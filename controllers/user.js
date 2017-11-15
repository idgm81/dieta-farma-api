const User      = require('../models/user');

module.exports.register = function(req, res, next) {
  // Return error if no email provided
  if (!req.body.user.email) {
    return res.status(400).send({ message: 'You must enter an email address'});
  }

  // Return error if no password provided
  if (!req.body.user.password) {
    return res.status(400).send({ message: 'You must enter a valid password' });
  }


  User.findOne({ email: req.body.user.email }).then((user) => {
    // If user exists, return error
    if (user) {
      return res.status(409).send({ message: 'Ya existe un usuario registrado con ese email' });
    }

    // If email is unique and password was provided, we create new user
    const newUser = new User(req.body.user);
    newUser.save().then((user) => {
      res.status(200).json({ user });
    }).catch((err) => {
      return next(err);
    });
  }).catch((err) => next(err));
};

module.exports.get = function(req, res) {

  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(409).json({ error: 'No user could be found for this ID' });
    }

    return res.status(200).json({ user });
  });
};

module.exports.getAll = function(req, res, next) {
  User.find({}, (err, users) => {
    if (err) {
      res.status(409).json({ error: 'No users could be found' });
      return next(err);
    }

    return res.status(200).json({ users });
  });
};

module.exports.delete = function(req, res, next) {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.status(409).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(409).json({ error: 'Can not remove user' });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
