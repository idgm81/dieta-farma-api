const nodemailer      = require('nodemailer');
const { smtpConfig }  = require('../config/mail');

module.exports.sendEmail = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);

  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: 'alta-online@dietafarma.es',
    subject: 'DietaFarma Online: Alta nuevo usuario',
    text: `Hola Jorge, tienes un nuevo cliente. Su email es: ${user.email}\n\nUn cordial saludo`
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      return console.log(err);
    }
    console.log('Message sent: %s', info.messageId);
  });
};
