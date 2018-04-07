const crypto          = require('crypto');
const User            = require('../models/user');
const passport        = require('../config/passport')();
const MailController  = require('./mail');

// Login user
module.exports.userAuth = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(401).json({ error: 'Email incorrecto' });
    } else {
      // check if password matches
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          // return the information including token as JSON
          const token = passport.generateToken({ id: user._id, role: user.role});

          res.status(200).json(token);
        } else {
          res.status(401).json({ error: 'Contraseña incorrecta' });
        }
      });
    }
  }).catch((err) => { throw err });
};

module.exports.refreshToken =  function(req, res) {
  let decoded;

  try {
    decoded = passport.verifyToken(req.body.refreshToken);
  } catch (error) {
    return res.status(500).json({ error });
  }


  User.findById(decoded.id).then((user) => {
    if (!user) {
      return res.status(401).json({ error: 'Usuario no econtrado' });
    } 
    
    const token = passport.generateToken({ id: user._id, role: user.role});
  
    return res.status(200).json(token);
  });
};

// Role authorization check
module.exports.roleAuthorization = function(requiredRole) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(409).json({ error: 'Usuario no encontrado' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role === requiredRole) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content' });
      return next('Unauthorized');
    })
  }
}

module.exports.checkEmail = function(req, res, next) {
  User.findOne({email: req.query.email}, (err, user) => {
    if (err || user === null) {
      res.status(409).json({ error: 'No user could be found for this email' });
      return next(err);
    }

    // If user is found, generate and save resetToken

    // Generate a token with Crypto
    crypto.randomBytes(48, (err, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err) { return next(err); }

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 60 * 15 * 1000 // 15 minutes

      user.save((err) => {
        // If error in saving token, return it
        if (err) {
          return res.status(500).json({ error: 'No se pudo resetear la contraseña' });
        }

        MailController.sendForgotPasswordNotification(user);

        return res.status(204).end();
      });
    });
  });
};

module.exports.modifyPassword = function(req, res) {

  User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      return res.status(403).json({ error: 'El token de seguridad ha caducado. Solicita otro cambio de contraseña' });
    }

    // Otherwise, save new password and clear resetPasswordToken from database

    resetUser.password = req.body.password;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      return res.status(204).json({ error: 'Server error' });
    });
  });
};
