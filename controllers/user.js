const MailController            = require('./mail');
const User                      = require('../models/user');

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

    let defaultNutritionist = '';
    User.find({ role: 'nutritionist'}).then((nutritionist) => { defaultNutritionist = nutritionist._id });
    // If email is unique and password was provided, we create new user
    const newUser = new User(req.body);

    newUser.set('nutriotionist', defaultNutritionist);
    newUser.save().then((user) => {
      MailController.sendEmail(user.email);
      res.status(200).json({ user: { _id: user._id }});

    }).catch((err) => {
      return next(err);
    });
  }).catch((err) => next(err));
};

module.exports.get = function(req, res) {

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(409).json({ errors: { msg: 'No user could be found for this ID' } });
    }

    return res.status(200).json({ user });
  });
};

module.exports.getAll = function(req, res, next) {
  const role = req.query.role;

  User.find({ role }, (err, users) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No users could be found' } });
      return next(err);
    }

    return res.status(200).json({ users });
  });
};

module.exports.modify = function(req, res, next) {
  User.update({ _id: req.params.id }, req.body, (err, user) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No user could be found for this ID.' } });
      return next(err);
    }

    return res.status(200).json({ user });
  });
};

module.exports.delete = function(req, res, next) {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No user could be found for this ID.' } });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(409).json({ error: { msg: 'Can not remove user' } });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
