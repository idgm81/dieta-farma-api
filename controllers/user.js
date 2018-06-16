const MailController  = require('./mail');
const User            = require('../models/user');
const mongoose        = require('mongoose');


module.exports.create = function(req, res, next) {
  // Return error if no email provided
  if (!req.body.email) {
    return res.status(400).send({ errors: { msg: 'Debes introducir una dirección de email válida' } });
  }

  // Return error if no password provided
  if (!req.body.password) {
    return res.status(400).send({ errors: { msg: 'Debes introducir una contraseña válida' } });
  }

  User.findOne({ email: req.body.email }).then((user) => {
    // If user exists, return error
    if (user) {
      return res.status(409).send({ errors: { msg: 'Ya existe un usuario registrado con ese email' } });
    }

    User.find({ role: 'N'}).then((nutritionist) => { 
      // If email is unique and password was provided, we create new user

      const newUser = new User(req.body);

      newUser.set('nutritionist', mongoose.Types.ObjectId(nutritionist._id));
      newUser.save().then((user) => {
        MailController.sendEmail(user);
        MailController.sendConfirmRegistration(user);

        return res.status(200).json({ user: { _id: user._id }});
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => next(err));
  }).catch((err) => next(err));
};

module.exports.get = function(req, res) {

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(409).json({ error: 'No se ha podido recuperar los datos de este usuario' });
    }

    return res.status(200).json({ user });
  });
};

module.exports.getAll = function(req, res, next) {
  const role = req.query.role;

  User.find({ role }, (err, users) => {
    if (err) {
      res.status(409).json({ error: 'No se ha podido recuperar la lista de usuarios' });
      return next(err);
    }

    return res.status(200).json({ users });
  });
};

module.exports.modify = function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
    if (err || !user) {
      res.status(409).json({ error: 'No se ha podido actualizar los datos de este usuario' });
    }

    return res.status(204).end();
  });
};

module.exports.delete = function(req, res, next) {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(409).json({ error: 'No se ha podido recuperar los datos de este usuario' });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(500).json({ error: 'No se ha podido dar de baja este usuario' });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};