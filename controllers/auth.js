const crypto          = require('crypto');
const nodemailer      = require('nodemailer');
const User            = require('../models/user');
const passport        = require('../config/passport')();
const { smtpConfig }  = require('../config/mail');

// Login user
module.exports.userAuth = function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    } else {
      // check if password matches
      user.comparePassword(password, function (err, isMatch) {
        if (isMatch && !err) {
          // return the information including token as JSON
          const tokenInfo = passport.generateToken({ email: user.email });
          const response = {
            id: user._id,
            role: user.role,
            token: tokenInfo.token,
            exp: tokenInfo.exp,
          }
          res.status(200).json(response);
        } else {
          res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }
      });
    }
  }).catch((err) => { throw err });
};

// Role authorization check
module.exports.roleAuthorization = function(requiredRole) {
  return function(req, res, next) {
    const user = req.user;

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(409).json({ error: 'No user was found.' });
        return next(err);
      }

      // If user is found, check role.
      if (foundUser.role === requiredRole) {
        return next();
      }

      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}

module.exports.forgotPassword = function(req, res, next) {
  const email = req.body.email;

  User.findOne({ email }, (err, existingUser) => {
    // If user is not found, return error
    if (err || existingUser == null) {
      res.status(409).json({ message: 'No existe ningún usuario con ese email registrado' });
      return next(err);
    }

    // If user is found, generate and save resetToken

    // Generate a token with Crypto
    crypto.randomBytes(48, (err, buffer) => {
      const resetToken = buffer.toString('hex');
      if (err) { return next(err); }

      existingUser.resetPasswordToken = resetToken;
      existingUser.resetPasswordExpires = Date.now() + 60 * 15 * 1000 // 15 minutes

      existingUser.save((err) => {
        // If error in saving token, return it
        if (err) { return next(err); }

        var smtpTransport = nodemailer.createTransport('SMTP', smtpConfig );

        const mailOptions = {
          to: existingUser.profile.email,
          from: 'jorgebaztan@dietafarma.es',
          subject: 'DietaFarma Online: Cambio de contraseña',
          text: `${'Has recibido este mensaje porque alguien ha solicitado el cambio de contraseña de tu cuenta eb DietaFarma\n\n' +
            'Por favor, haz click en el siguiente enlace para continuar el proceso:\n\n' +
            'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
            'Si no has solicitado este cambio, por favor ignora este email y tu contraseña no será modificada.\n'
        };

        smtpTransport.sendMail(mailOptions, function(err) {
          next(err, 'done');
        });

        return res.status(200).json({ message: 'Por favor, revisa la bandeja de entrada de tu correo y sigue las instrucciones para resetear tu contraseña' });
      });
    });
  });
};

module.exports.refreshToken =  function(req, res, next) {

};

module.exports.verifyToken = function(req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, resetUser) => {
    // If query returned no results, token expired or was invalid. Return error.
    if (!resetUser) {
      res.status(403).json({ error: 'Your token has expired. Please attempt to reset your password again.' });
    }

    // Otherwise, save new password and clear resetToken from database
    resetUser.password = req.body.password;
    resetUser.resetPasswordToken = undefined;
    resetUser.resetPasswordExpires = undefined;

    resetUser.save((err) => {
      if (err) { return next(err); }

      // If password change saved successfully, alert user via email
      const message = {
        subject: 'Password Changed',
        text: 'You are receiving this email because you changed your password. \n\n' +
          'If you did not request this change, please contact us immediately.'
      };

        // Otherwise, send user email confirmation of password change via Mailgun
      nodemailer.sendEmail(message);

      return res.status(200).json({ message: 'Password changed successfully. Please login with your new password.' });
    });
  });
};
