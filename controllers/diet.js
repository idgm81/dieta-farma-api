const Diet                      = require('../models/diet');
const User                      = require('../models/user');
const MailController            = require('./mail');

module.exports.get = function(req, res) {
  Diet.find({ client: req.query.userId }, (err, diets) => {
    if (err) {
      return res.status(409).json({ errors: 'No diet found fot this user' });
    }

    return res.status(200).json({ diets });
  });
};

module.exports.create = function(req, res, next) {
  const newDiet = new Diet(req.body);

  newDiet.save().then((diet) => {
    User.findByIdAndUpdate(req.body.client, { '$push': { 'profile.diets': diet._id } }, (err, user) => {
      if (err) {
        res.status(409).json({ errors: { msg: 'Can not assign this diet to client' } });
        return next(err);
      }

      MailController.sendDietNotification(user);

      return res.status(200).json({ diet });
    });
  }).catch((err) => {
    return next(err);
  });
};

module.exports.modify = function(req, res, next) {
  Diet.findByIdAndUpdate(req.params.id, req.body.diet, (err, diet) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No diet could be found for this ID.' } });
      return next(err);
    }

    return res.status(200).json({ diet });
  });
};

module.exports.delete = function(req, res, next) {
  Diet.findById(req.params.id, (err, diet) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No diet found with this ID' } });
      return next(err);
    }
    diet.remove((err) => {
      if (err) {
        res.status(409).json({ errors: { msg: 'Can not delete diet' } });
        return next(err);
      }

      User.findByIdAndUpdate(req.query.userId, { '$pull': { 'profile.diets': diet._id } }, (err) => {
        if (err) {
          res.status(409).json({ errors: { msg: 'Can not delete client diet' } });
          return next(err);
        }
      });

      return res.status(204).end();
    });
  });
};
