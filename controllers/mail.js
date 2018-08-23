const nodemailer      = require('nodemailer');
const mailerhbs       = require('nodemailer-express-handlebars');
const { smtpConfig }  = require('../config/mail');
const moment          = require('moment');

module.exports.sendNewCustomerEmail = function(user) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: 'alta-online@dietafarma.es',
    subject: 'DietaFarma Online: Alta nuevo usuario',
    text: `Hola Jorge, tienes un nuevo cliente. Su nombre es ${user.profile.name} ${user.profile.surname} y su email ${user.email}\n\nUn cordial saludo`,
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
      header: `Hola ${user.profile.name}`,
      body: `Has recibido este mensaje porque has solicitado el cambio de contraseña de tu cuenta en DietaFarma Online.\n\n
      Por favor, haz click en el enlace de más abajo para continuar el proceso.\n\n
      Si no has solicitado este cambio, por favor ignora este email y tu contraseña no será modificada.\n`,
      host: (process.env.NODE_ENV === 'development') ? 'localhost:4200' : 'dieta-farma-online.herokuapp.com',
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
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: user.email,
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Nueva dieta',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nueva dieta',
      header: `Hola ${user.profile.name}`,
      body: 'Tu nutricionista online ha puesto a tu disposición en la plataforma un nuevo documento. Para descargarlo diríjete a https://dieta-farma-online.herokuapp.com/login e introduce tu usuario y contraseña para acceder a la aplicación.\nEn caso de no poder acceder envía un correo a info@dietafarma.es exponiendo tu problema de acceso. Si puedes verlo pero te surgen dudas sobre el documento o de cómo realizar algunos aspectos (en el caso de tratarse de una dieta personalizada), escribe tu duda en el apartado “Mensajes” de la plataforma.\nRecibe un cordial saludo'
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

module.exports.sendNewDietQuestionsNotification = function(user, data) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: `${user.email}`,
    subject: 'DietaFarma Online: Nuevo formulario de dieta',
    template: 'answers',
    context: {
      title: 'DietaFarma Online: Nuevo formulario de dieta',
      header: `Hola Jorge, ${user.profile.name} ${user.profile.surname} ha solicitado una nueva dieta. Esto es lo que ha respondido al formulario:`,
      q1: 'Escribe tus medidas de: peso (kg), contornos (cm) de muñeca, cintura, cadera, pierna, brazo, tórax. Porcentaje de grasa (%) si tu báscula dispone de algún tipo de medida en este sentido (especificar báscula si fuera posible)',
      a1: `R: ${data.q1}`,
      q2: '¿Has seguido la dieta propuesta por tu nutricionista de forma continuada? Escoge un valor de 0 a 5',
      a2: `R: ${data.q2}`,
      q3: '¿Qué aspectos te gustan más de la dieta?',
      a3: `R: ${data.q3}`,
      q4: '¿Qué es imposible de seguir?',
      a4: `R: ${data.q4}`,
      q5: '¿Quieres añadir algún alimento concreto que eches de menos?',
      a5: `R: ${data.q5}`,
      q6: '¿Consigues que no pasen más de 5 horas entre tomas?',
      a6: `R: ${data.q6}`,
      q7: 'Puntúa de 0 a 5 (cero es nunca, 5 es diario) el consumo del ultraprocesados como cereales de desayuno, refrescos, galletas, bollería, comida rápida (pizza, hamburguesa)',
      a7: `R: ${data.q7}`,
      q8: '¿Crees que has seguido bien la dieta acercándote a tu objetivo?',
      a8: `R: ${data.q8}`,
      q9: '¿Cumpliste el objetivo de tomar 5 frutas/verduras/hortalizas diferentes al día? En caso negativo, ¿por qué?',
      a9: `R: ${data.q9}`,
      q10: '¿Tomaste las cantidades de alimentos proteicos propuestos? (por ejemplo huevos, pollo, pavo, ternera, pescado)? En caso negativo, ¿por qué?',
      a10: `R: ${data.q10}`,
      q11: '¿Cumpliste el objetivo de tomar 5 frutas/verduras/hortalizas diferentes al día? En caso negativo, ¿por qué?',
      a11: `R: ${data.q11}`,
      q12: 'Si tu objetivo tiene un componente deportivo, ¿lograste entrenar todos los días que te habías propuesto? En caso negativo, ¿por qué?',
      a12: `R: ${data.q12}`,
      q13: '¿Estás dispuesto a probar alimentos que nunca antes hayas probado?',
      a13: `R: ${data.q13}`,
      q14: '¿Has usado el apartado mensajes de la plataforma alguna vez? ¿Te gusta y te parece fácil de usar?',
      a14: `R: ${data.q14}`,
      q15: '¿Quieres que realice algún taller online/artículo en blog sobre algún tema concreto que te interese para incorporar a tu dieta?',
      a15: `R: ${data.q15}`,
      q16: '¿Quieres añadir algún comentario que no haya sido tratado en preguntas anteriores?',
      a16: `R: ${data.q16}`
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

module.exports.sendAppointmentNotification = function(user, appointment) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: `${user.email}`,
    cc: 'jorgebaztan@dietafarma.es',
    from: 'citas@dietafarma.es',
    subject: 'DietaFarma Online: Nueva cita',
    text: `Se ha reservado una cita ${appointment.type === 'P' ? 'presencial' : 'por videollamada skype'} con ${user.profile.name} ${user.profile.surname} el próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')}`,
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

module.exports.sendCancelAppointmentNotification = function(user, appointment) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: `${user.email}`,
    cc: 'jorgebaztan@dietafarma.es',
    from: 'citas@dietafarma.es',
    subject: 'DietaFarma Online: Cita cancelada',
    text: `La cita ${appointment.type === 'P' ? 'presencial' : 'por videollamada skype'} del próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')} ha sido cancelada`,
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
      body: 'Tu nutricionista online te ha escrito un nuevo mensaje. Para leerlo diríjete a https://dieta-farma-online.herokuapp.com/login e introduce tu usuario y contraseña para acceder a la aplicación.\nRecibe un cordial saludo'
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
