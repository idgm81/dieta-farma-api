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
    subject: 'DietaFarma Online: Nueva dieta',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nueva dieta',
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

module.exports.sendRequestNewDietNotification = function(user, data) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  smtpTransport.use('compile', mailerhbs({
    viewPath: './public/assets', //Path to email template folder
    extName: '.hbs'
  }));
  const mailOptions = {
    to: user.email,
    from: 'info@dietafarma.es',
    subject: 'DietaFarma Online: Nueva solicitud de dieta',
    template: 'email',
    context: {
      title: 'DietaFarma Online: Nueva solicitud de dieta',
      header: 'Hola Jorge',
      body: `${user.profile.name} ${user.profile.surname} ha solicitado una nueva dieta. Esto es lo que ha respondido al formulario:\n
        \nEscribe tus medidas de: peso (kg), contornos (cm) de muñeca, cintura, cadera, pierna,
        brazo, tórax. Porcentaje de grasa (%) si tu báscula dispone de algún tipo de medida en este sentido (especificar báscula si fuera posible)
        \nR: ${data.q1}
        \n¿Has seguido la dieta propuesta por tu nutricionista de forma continuada? Escoge un valor de 0 a 5
        \nR: ${data.q2}
        \n¿Qué aspectos te gustan más de la dieta?
        \nR: ${data.q3}
        ¿Qué es imposible de seguir?
        \nR: ${data.q4}
        ¿Quieres añadir algún alimento concreto que eches de menos?
        \nR: ${data.q5}
        ¿Consigues que no pasen más de 5 horas entre tomas?
        \nR: ${data.q6}
        Puntúa de 0 a 5 (cero es nunca, 5 es diario) el consumo del ultraprocesados como cereales de desayuno, refrescos, galletas, bollería, comida rápida (pizza, hamburguesa)
        \nR: ${data.q7}
        ¿Crees que has seguido bien la dieta acercándote a tu objetivo?
        \nR: ${data.q8}
        ¿Cumpliste el objetivo de tomar 5 frutas/verduras/hortalizas diferentes al día? En caso
        negativo, ¿por qué?
        \nR: ${data.q9}
        ¿Tomaste las cantidades de alimentos proteicos propuestos? (por ejemplo huevos pollo
        pavo ternera pescado)? En caso negativo, ¿por qué?
        \nR: ${data.q10}
        ¿Cumpliste el objetivo de tomar 5 frutas/verduras/hortalizas diferentes al día? En caso
        negativo, ¿por qué?
        \nR: ${data.q11}
        Si tu objetivo tiene un componente deportivo, ¿lograste entrenar todos los días que te
        habías propuesto? En caso negativo, ¿por qué?
        \nR: ${data.q12}
        ¿Estás dispuesto a probar alimentos que nunca antes hayas probado?
        \nR: ${data.q13}
        ¿Has usado el apartado mensajes de la plataforma alguna vez? ¿Te gusta y te parece fácil de usar?
        \nR: ${data.q14}
        ¿Quieres que realice algún taller online/artículo en blog sobre algún tema concreto que te interese para incorporar a tu dieta?
        \nR: ${data.q15}
        ¿Quieres añadir algún comentario que no haya sido tratado en preguntas anteriores?
        \nR: ${data.q16}`
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

module.exports.sendAppointmentNotification = function(user, appointment) {
  const smtpTransport = nodemailer.createTransport(smtpConfig);
  const mailOptions = {
    to: 'jorgebaztan@dietafarma.es',
    from: 'citas@dietafarma.es',
    subject: 'DietaFarma Online: Nueva cita',
    text: `Hola Jorge, tienes una cita ${appointment.type === 'P' ? 'presencial' : 'via skype'} con ${user.profile.name} ${user.profile.surname} el próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')}`
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
