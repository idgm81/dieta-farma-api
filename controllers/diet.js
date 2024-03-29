const Diet              = require('../models/diet');
const User              = require('../models/user');
const MailController    = require('./mail');
const mongoose          = require('mongoose');

module.exports.get = function(req, res) {
  Diet.aggregate([
    { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customer_data' } },
    { $match: { customer: mongoose.Types.ObjectId(req.query.userId) } },
    { $sort: { createdAt: -1 } }])
    .exec((error, diets) => {
      if (error) {
        console.log(error);
        return res.status(409).json({ error: 'Error al buscar las dietas del cliente' });
      }

      return res.status(200).json({ diets });
    });
};

module.exports.create = function(req, res) {
  const newDiet = new Diet(req.body);

  newDiet.save().then((diet) => {
    if (diet.type === 'D') {
      return User.findByIdAndUpdate(req.body.customer, { $set: { 'profile.pendingDiet': false }}).then((user) => {

        MailController.sendDietNotification(user);

        return res.status(200).json({ diet });
      }).catch((error) => {
        console.log(error);
        return res.status(409).json({ error: 'Error al guardar la dieta' });
      });
    }

    return User.findById(req.body.customer).then((user) => {
      if (!user) {
        return res.status(409).json({ error: 'Error al guardar la dieta, No existe el usuario' });
      }

      MailController.sendDietNotification(user);

      return res.status(200).json({ diet });
    }).catch((error) => {
      console.log(error);
      return res.status(409).json({ error: 'Error al guardar la dieta' });
    });
  }).catch((error) => {
    console.log(error);
    return res.status(409).json({ error: 'Error al guardar la dieta' });
  });
};

module.exports.modify = function(req, res) {
  Diet.findByIdAndUpdate(req.params.id, req.body.diet, (error, diet) => {
    if (error) {
      console.log(error);
      return res.status(409).json({ error: 'Error al modificar la dieta' });
    }

    return res.status(200).json({ diet });
  });
};

module.exports.delete = function(req, res) {
  Diet.findById(req.params.id, (error, diet) => {
    if (error || !diet) {
      console.log(error);
      return res.status(409).json({ error: 'Error al borrar la dieta' });
    }

    diet.remove((error) => {
      if (error) {
        console.log(error);
        return res.status(409).json({ error: 'Error al borrar la dieta' });
      }

      return res.status(204).end();
    });
  });
};
