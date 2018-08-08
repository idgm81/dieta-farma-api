const Diet              = require('../models/diet');
const User              = require('../models/user');
const MailController    = require('./mail');
const mongoose          = require('mongoose');

module.exports.get = function(req, res) {
  Diet.aggregate([
    { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customer_data' } },
    { $match: { customer: mongoose.Types.ObjectId(req.query.userId) } },
    { $sort: { createdAt: -1 } }])
    .exec((err, diets) => {
      if (err) {
        return res.status(409).json({ error: 'Error al buscar las dietas del cliente' });
      }

      return res.status(200).json({ diets });
    });
};

module.exports.create = function(req, res, next) {
  const newDiet = new Diet(req.body);

  newDiet.save().then((diet) => {
    User.findById(req.body.customer, (err, user) => {
      if (err) {
        res.status(409).json({ error: 'Error al guardar la dieta' });
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
      res.status(409).json({ error: 'Error al modificar la dieta' });
      return next(err);
    }

    return res.status(200).json({ diet });
  });
};

module.exports.delete = function(req, res, next) {
  Diet.findById(req.params.id, (err, diet) => {
    if (err) {
      res.status(409).json({ error: 'Error al borrar la dieta' });
      return next(err);
    }
    diet.remove((err) => {
      if (err) {
        res.status(409).json({ error: 'Error al borrar la dieta' });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
