const MailController  = require('./mail');
const User            = require('../models/user');
const mongoose        = require('mongoose');

module.exports.create = function(req, res, next) {
  // Return error if no email provided
  if (!req.body.email) {
    return res.status(400).send({ error: 'Debes introducir una dirección de email válida' });
  }

  // Return error if no password provided
  if (!req.body.password) {
    return res.status(400).send({ error: 'Debes introducir una contraseña válida' });
  }

  return User.findOne({ email: req.body.email }).then((user) => {
    // If user exists, return error
    if (user) {
      return res.status(409).send({ error : 'Ya existe un usuario registrado con ese email' });
    }

    return User.findOne({ role: 'N' }).then((nutritionist) => { 
      // If email is unique and password was provided, we create new user

      const newUser = new User(req.body);

      newUser.set('nutritionist', mongoose.Types.ObjectId(nutritionist._id));

      return newUser.save().then((user) => {
        MailController.sendNewCustomerNotification(user);
        MailController.sendConfirmRegistration(user);

        return res.status(200).json({ user: { _id: user._id }});
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => next(err));
  }).catch((err) => next(err));
};

module.exports.get = function(req, res) {
  User.findById(req.params.id, (error, user) => {
    if (error) {
      console.log(error);
      return res.status(409).json({ error: 'No se ha podido recuperar los datos de este usuario' });
    }

    return res.status(200).json({ user });
  });
};

module.exports.getAll = function(req, res) {
  const role = req.query.role;

  User.find({ role }, (error, users) => {
    if (error) {
      console.log(error);
      return res.status(409).json({ error: 'No se ha podido recuperar la lista de usuarios' });
    }

    return res.status(200).json({ users });
  });
};

module.exports.modify = function(req, res) {
  const user_data = req.body;

  User.findByIdAndUpdate(req.params.id, { $set: user_data }, { new: true }, (error, user) => {
    if (error || !user) {
      console.log(error);
      return res.status(409).json({ error: 'No se ha podido actualizar los datos de este usuario' });
    }

    if (Object.keys(user_data)[0] === 'profile.credits') {
      MailController.sendUpdateCreditsNotification(user, Object.values(user_data)[0]);
    }

    return res.status(200).json({ user });
  });
};

module.exports.delete = function(req, res) {
  User.findById(req.params.id, (error, user) => {
    if (error || !user) {
      console.log(error);
      return res.status(409).json({ error: 'No se ha podido recuperar los datos de este usuario' });
    }

    user.remove((error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'No se ha podido dar de baja este usuario' });
      }

      MailController.sendDeletedCustomerNotification(user);

      return res.status(204).end();
    });
  });
};
