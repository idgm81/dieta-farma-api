const nodemailer      = require('nodemailer');
const mailerhbs       = require('nodemailer-express-handlebars');
const { smtpConfig }  = require('../config/mail');
const mailerOptions   = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: './views/layouts',
    partialsDir: './views/partials'
  },
  viewPath: './views/partials', //Path to email template folder
  extName: '.hbs'
};

module.exports.sendNewCustomerNotification = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    cc: 'joseotamendi@gmail.com',
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Alta nuevo usuario',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Alta nuevo usuario',
      header: 'Hola Jorge',
      message: `Hola Jorge, tienes un nuevo cliente. Su nombre es ${user.profile.name} ${user.profile.surname} y su email ${user.email}.Un cordial saludo`,
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendDeletedCustomerNotification = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    cc: 'joseotamendi@gmail.com',
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Baja usuario',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Bajausuario',
      header: 'Hola Jorge',
      message: `Hola Jorge, ${user.profile.name} ${user.profile.surname} (${user.email}), se ha dado de baja del servicio. Un cordial saludo`,
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: user.email,
    from: 'alta-online@dietafarma.es',
    subject: 'DietaFarma Online: Registro completado',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Registro completado',
      header: `Hola ${user.profile.name}`,
      message: 'Te has registrado en Dietafarma online con éxito. Esta plataforma te mantendrá conectado conmigo, tu nutricionista online Jorge Baztán. Gracias a la información que me has facilitado podré recomendarte la dieta que mejor se adapte a ti para lograr tu objetivo.',
      video: false,
      prices: true,
      steps: true
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: user.email,
    from: 'gestion@dietafarma.es',
    subject: 'DietaFarma Online: Cambio de contraseña',
    template: 'change-password',
    context: {
      title: 'DietaFarma Online: Cambio de contraseña',
      header: `Hola ${user.profile.name}`,
      message: `Has recibido este mensaje porque has solicitado el cambio de contraseña de tu cuenta en DietaFarma Online.
      Por favor, haz click en el enlace de más abajo para continuar el proceso.
      Si no has solicitado este cambio, por favor ignora este email y tu contraseña no será modificada.`,
      host: (process.env.NODE_ENV === 'development') ? 'localhost:4200' : 'www.dietafarma.es',
      token: `${user.resetPasswordToken}`
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: user.email,
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Nueva dieta',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nueva dieta',
      header: `Hola ${user.profile.name}`,
      message: 'Tu nutricionista online ha puesto a tu disposición en la plataforma un nuevo documento. Para descargarlo dirígete a https://www.dietafarma.es/login e introduce tu usuario y contraseña para acceder a la aplicación. En caso de no poder acceder envía un correo a info@dietafarma.es exponiendo tu problema de acceso. Si puedes verlo pero te surgen dudas sobre el documento o de cómo realizar algunos aspectos (en el caso de tratarse de una dieta personalizada), escribe tu duda en el apartado “Mensajes” de la plataforma. Recibe un cordial saludo'
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendAppointmentNotification = function(email, userName, body) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: email,
    from: 'info@dietafarma.es',
    cc: 'jorgebaztan@dietafarma.es;joseotamendi@gmail.com',
    subject: 'DietaFarma Online: Nueva cita',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nueva cita',
      header: `Hola ${userName}`,
      body,
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendCancelAppointmentNotification = function(user, message) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: user.email,
    from: 'info@dietafarma.es',
    cc: 'jorgebaztan@dietafarma.es;joseotamendi@gmail.com',
    subject: 'DietaFarma Online: Cita cancelada',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Cita cancelada',
      header: `Hola ${user.profile.name}`,
      message
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: to.email,
    from: from.email,
    cc: 'joseotamendi@gmail.com',
    subject: 'DietaFarma Online: Tienes un nuevo mensaje',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Tienes un nuevo mensaje',
      header: `Hola ${to.profile.name}`,
      message: 'Has recibido un nuevo mensaje. Para leerlo dirígete a https://www.dietafarma.es/login e introduce tu usuario y contraseña para acceder a la aplicación. Recibe un cordial saludo'
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendUpdateCreditsNotification = function (user, credits) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: user.email,
    cc: 'jorgebaztan@dietafarma.es;joseotamendi@gmail.com',
    from: 'info@dietafarma.es',
    subject: `DietaFarma Online: Créditos gratis`,
    template: 'email',
    context: {
      title: `DietaFarma Online: Créditos gratis`,
      header: `Hola ${user.profile.name}`,
      message: `Tu nutricionista te ha regalado creditos para que puedas solicitar nuevas dietas. Ahora dispones de un total de ${credits} créditos (${Math.round(Number(credits) * 15 * 100) / 100} €). Un saludo`
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendPurchaseNotification = function(user, description) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    cc: 'joseotamendi@gmail.com',
    from: 'info@dietafarma.es',
    subject: `DietaFarma Online: Nueva solicitud ${description}`,
    template: 'email',
    context: {
      title: `DietaFarma Online: Nueva solicitud ${description}`,
      header: 'Hola Jorge',
      message: `Tu cliente ${user.profile.name} ${user.profile.surname}, ha solicitado una nueva dieta. Un saludo`
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendPurchaseCustomerNotification = function(user, description) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: user.email,
    from: 'info@dietafarma.es',
    subject: `DietaFarma Online: Nueva solicitud ${description}`,
    template: 'email',
    context: {
      title: `DietaFarma Online: Nueva solicitud ${description}`,
      header: `Hola ${user.profile.name}`,
      message: `Te confirmamos que tu solicitud de una nueva ${description} ha sido recibida por tu nutricionista. En el caso de haber solicitado un servicio online, recibirás tu dieta en un plazo máximo de 48 horas. Un saludo`
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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

module.exports.sendPurchaseErrorNotification = function(email, error) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs(mailerOptions));
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    cc: 'joseotamendi@gmail.com',
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Error al realizar pago',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Error al realizar pago',
      header: 'Hola Jorge',
      message: `El cliente con email ${email} ha intentado realizar un pago sin éxito. El error devuelto fue: ${error.message}`
    },
    attachments: [{
      filename: 'article.png',
      path: './public/assets/images/article.png',
      cid: 'article@dietafarma'
    }, {
      filename: 'logo-dietafarma-basic-white.png',
      path: './public/assets/images/logo-dietafarma-basic-white.png',
      cid: 'logo@dietafarma'
    }, {
      filename: 'facebook.png',
      path: './public/assets/images/facebook.png',
      cid: 'facebook@dietafarma'
    }, {
      filename: 'twitter.png',
      path: './public/assets/images/twitter.png',
      cid: 'twitter@dietafarma'
    }, {
      filename: 'instagram.png',
      path: './public/assets/images/instagram.png',
      cid: 'instagram@dietafarma'
    }]
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
