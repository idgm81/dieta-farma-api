const Diet = require('../models/diet');

module.exports.get = function(req, res) {
  Diet.find({$or: [{ client: req.params.id }, { nutritionist: req.params.id }]}, (err, diets) => {
    if (err) {
      return res.status(409).json({ errors: 'No diet found fot this user' });
    }

    return res.status(200).json({ diets });
  });
};

module.exports.create = function(req, res, next) {
  const newDiet = new Diet(req.body);

  newDiet.save().then((diet) =>
    res.status(200).json({ diet })
  ).catch((err) => {
    return next(err);
  });
};

module.exports.modify = function(req, res, next) {
  Diet.update({ _id: req.params.id }, req.body.diet, (err, diet) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No diet could be found for this ID.' } });
      return next(err);
    }

    return res.status(200).json({ diet });
  });
};

module.exports.delete = function(req, res, next) {
  Diet.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No diet found with this ID' } });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(409).json({ errors: { msg: 'Can not delete diet' } });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
