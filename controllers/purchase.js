const Purchase          = require('../models/purchase');
const User              = require('../models/user');

module.exports.get = function(req, res) {
  Purchase.find({ customer: req.params.userId })
    .exec((err, purchases) => {
      if (err) {
        return res.status(409).json({ error: 'Error al buscar las dietas del cliente' });
      }

      return res.status(200).json({ purchases });
    });
};

module.exports.create = function(req, res, next) {
  const newPurchase = new Purchase(req.body);

  newPurchase.save().then((purchase) => {
    User.findByIdAndUpdate(req.body.customer, { $set: { isPremium: true }, $inc: { 'profile.credits': 1 } } , (err, user) => {
      if (err) {
        res.status(409).json({ error: 'Error al guardar la compra' });
        return next(err);
      }

      return res.status(200).json({ purchase });
    });
  }).catch((err) => {
    return next(err);
  });
};

module.exports.delete = function(req, res, next) {
  Purchase.findById(req.params.id, (err, purchase) => {
    if (err) {
      res.status(409).json({ error: 'Error al borrar la compra' });
      return next(err);
    }
    purchase.remove((err) => {
      if (err) {
        res.status(409).json({ error: 'Error al borrar la compra' });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
