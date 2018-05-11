const nodemailer      = require('nodemailer');
const mailerhbs       = require('nodemailer-express-handlebars');
const { smtpConfig }  = require('../config/mail');
const moment          = require('moment');

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
      console.log(err);
      return smtpTransport.close();
    }

    console.log('Message sent: %s', info.messageId);
    return smtpTransport.close();
  });
};

module.exports.sendConfirmRegistration = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: user.email,
    from: 'alta-online@dietafarma.es',
    subject: 'DietaFarma Online: Registro completado',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Registro completado',
      header: `Estimado ${user.profile.name}`,
      body: 'Bienvenido a Dietafarma online. Desde este momento tienes a tu disposición una plataforma online para que te sea más sencillo realizar tus consultas a tu nutriocionista. Diríjete a https://dieta-farma-online.herokuapp.com/login e introduce tu usuario y contraseña para acceder a la aplicación.\nEn caso de no poder acceder envía un correo a info@dietafarma.es exponiendo tu problema de acceso.\nRecibe un cordial saludo'
    }
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      return smtpTransport.close();
    }

    console.log('Message sent: %s', info.messageId);
    return smtpTransport.close();
  });
};

module.exports.sendForgotPasswordNotification = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: user.email,
    from: 'gestion@dietafarma.es',
    subject: 'DietaFarma Online: Cambio de contraseña',
    template: 'change-password',
    context: {
      title: 'DietaFarma Online: Cambio de contraseña',
      header: `Estimado ${user.profile.name}`,
      body: `Has recibido este mensaje porque has solicitado el cambio de contraseña de tu cuenta en DietaFarma Online.\n\n
      Por favor, haz click en el enlace de más abajo para continuar el proceso.\n\n
      Si no has solicitado este cambio, por favor ignora este email y tu contraseña no será modificada.\n`,
      host: (process.env.NODE_ENV === 'development') ? 'localhost:4200' : 'dieta-farma-online.herokuapp.com',
      token: `${user.resetPasswordToken}`
    }
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      return smtpTransport.close();
    }

    console.log('Message sent: %s', info.messageId);
    return smtpTransport.close();
  });
};

module.exports.sendDietNotification = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: user.email,
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Nueva información en su muro',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nueva información en su muro',
      header: `Estimado ${user.profile.name}`,
      body: 'Tu nutricionista online ha puesto a tu disposición en la plataforma un nuevo documento. Para descargarlo diríjete a https://dieta-farma-online.herokuapp.com/login e introduce tu usuario y contraseña para acceder a la aplicación.\nEn caso de no poder acceder envía un correo a info@dietafarma.es exponiendo tu problema de acceso. Si puedes verlo pero te surgen dudas sobre el documento o de cómo realizar algunos aspectos (en el caso de tratarse de una dieta personalizada), escribe tu duda en el apartado “Mensajes” de la plataforma.\nRecibe un cordial saludo'
    }
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      return smtpTransport.close();
    }

    console.log('Message sent: %s', info.messageId);
    return smtpTransport.close();
  });
};

module.exports.sendAppointmentNotification = function(appointment) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: 'citas@dietafarma.es',
    subject: 'DietaFarma Online: Nueva cita',
    text: `Hola Jorge, tienes una cita el próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')}`
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      return smtpTransport.close();
    }

    console.log('Message sent: %s', info.messageId);
    return smtpTransport.close();
  });
};

module.exports.sendMessageNotification = function(from, to) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: to.email,
    from: from.email,
    subject: 'DietaFarma Online: Nuevo mensaje de tu nutricionista',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nuevo mensaje de tu nutricionista',
      header: `Estimado ${to.profile.name}`,
      body: 'Tu nutricionista online ha contestado a tu último mensaje. Para leerlo diríjete a https://dieta-farma-online.herokuapp.com/login e introduce tu usuario y contraseña para acceder a la aplicación.\nuRecibe un cordial saludo'
    }
  };

  smtpTransport.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
      return smtpTransport.close();
    }

    console.log('Message sent: %s', info.messageId);
    return smtpTransport.close();
  });
};
