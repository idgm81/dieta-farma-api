const nodemailer      = require('nodemailer');
const { smtpConfig }  = require('../config/mail');

module.exports.sendEmail = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: 'alta-online@dietafarma.es',
    subject: 'DietaFarma Online: Alta nuevo usuario',
    text: `Hola Jorge, tienes un nuevo cliente. Su nombre es ${user.profile.name} ${user.profile.surname} y su email ${user.email}\n\nUn cordial saludo`
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }

    console.log('Message sent: %s', info.messageId);
  });
};

module.exports.sendDietNotification = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: user.email,
    from: 'jorgebaztan@dietafarma.es',
    subject: 'DietaFarma Online: Nueva dieta',
    text: `Hola ${user.profile.name},\nya tienes tu dieta disponible en la web https://dieta-farma-online.herokuapp.com.\n\nUn cordial saludo`
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }

    console.log('Message sent: %s', info.messageId);
  });
};

module.exports.sendMessageNotification = function(user, message) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: user.email,
    subject: 'DietaFarma Online: Nuevo Mensaje',
    text: `Hola Jorge,\n${user.profile.name} te ha mandado un mensaje:\n\nAsunto:${message.title}\nMensaje:${message.text}`
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }

    console.log('Message sent: %s', info.messageId);
  });
};
