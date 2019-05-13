const Appointment     = require('../models/appointment');
const User            = require('../models/user');
const MailController  = require('./mail');
const moment          = require('moment');
const mongoose        = require('mongoose');

module.exports.get = function(req, res) {
  Appointment.aggregate([
    { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customer_data' } },
    { $match: { $or: [{ customer: mongoose.Types.ObjectId(req.query.userId) }, { nutritionist: mongoose.Types.ObjectId(req.query.userId) }] } },
    { $sort: { date: 1 } }])
    .exec((err, appointments) => {
      if (err) {
        return res.status(409).json({ error: 'Error al buscar las citas del suario'});
      }

      return res.status(200).json({ appointments });
    });
};

module.exports.getCalendar = function(req, res) {
  User.findById(req.query.userId, (err, user) => {
    if (err || !user) {
      return res.status(409).json({ error: 'Error al buscar las citas del usuario'});
    }

    Appointment.find({ nutritionist: mongoose.Types.ObjectId(user.nutritionist) }, (err, nutritionistDates) => {
      if (err) {
        return res.status(409).json({ error: 'Error al buscar el calendario del nutricionista'});
      }

      const calendar = getFlatCalendar();
      const parseNutritionistDates = parseAppointments(nutritionistDates);
      const availableDates = calendar.filter((date) => !parseNutritionistDates.includes(date));

      return res.status(200).json({ calendar: formatCalendar(availableDates) });

      function parseAppointments(appointments) {
        return appointments.map((item) => {
          return moment(item.date).utc().format('YYYY-MM-DD HH:mm');
        });
      }

      function getFlatCalendar() {
        const list = [];
      
        for (let i=1; i<31; i++) {
          const jobDay = moment().add(i, 'day');
          const jobHours = [
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30',
            '13:00', '13:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30'];
    
          if (jobDay.get('day') > 0 && jobDay.get('day') < 6) {
            jobHours.forEach((h) => list.push(`${jobDay.format('YYYY-MM-DD')} ${h}`));
          }
        }
      
        return list;
      }

      function formatCalendar(calendar) {
        let formatted = [];
        let jobDay = '';
        let jobHour = '';
        let index = 0;
        for (let i=0; i<calendar.length; i++) {
          jobDay = calendar[i].split(' ')[0];
          jobHour = calendar[i].split(' ')[1];
          if (i===0) {
            formatted.push({ day: jobDay, hours: []});
            formatted[index].hours.push(jobHour);
          } else {
            if (jobDay !== calendar[i-1].split(' ')[0]) {
              index++;
              formatted.push({ day: jobDay, hours: [] });
              formatted[index].hours.push(jobHour);
            } else {
              formatted[index].hours.push(jobHour);
            }
          }
        }

        return formatted;
      }
    });
  });
};

module.exports.create = function(req, res) {
  User.findById(req.body.customer, (err, user) => {
    if (err || !user) {
      return res.status(409).json({ error: 'Error al buscar el cliente de la cita' });
    }

    const appointment = {
      customer: user._id,
      nutritionist: user.nutritionist,
      type: req.body.type,
      date: req.body.date
    };

    const newApp = new Appointment(appointment);
    
    return newApp.save().then((appointment) => {
      let body = `Has reservado una cita ${appointment.type === 'P' ? 'presencial' : 'por videollamada skype'} con el próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')}`;

      MailController.sendAppointmentNotification(user.email, user.profile.name, body);

      body = `Tu cliente ${user.profile.name} ${user.profile.surname}, ha reservado una cita ${appointment.type === 'P' ? 'presencial' : 'por videollamada skype'} el próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')}`;
      MailController.sendAppointmentNotification('jorgebaztan@dietafarma.es', 'Jorge', body);

      return res.status(200).json({ appointment });
    }).catch(() => res.status(409).json({ error: 'Error al reservar la cita' }));
  });
};

module.exports.modify = function(req, res) {
  Appointment.findByIdAndUpdate(req.params.id, req.body, (err, appointment) => {
    if (err) {
      return res.status(409).json({ error: 'Error al modificar la cita' });
    }

    return res.status(200).json({ appointment });
  });
};

module.exports.delete = function(req, res) {
  Appointment.findById(req.params.id, (err, appointment) => {
    if (err || !appointment) {
      return res.status(409).json({ error: 'Error al borrar la cita' });
    }

    appointment.remove((err) => {
      if (err) {
        return res.status(409).json({ error: 'Error al borrar la cita' });
      }

      if (req.query.updateCredits) {
        const credits = appointment.type === 'P' ? 3 : 2;

        return User.findByIdAndUpdate(appointment.customer, { $inc: { 'profile.credits' : credits }}, (err, user) => {
          if (err) {
            return res.status(409).json({ error: 'Error al buscar el cliente de la cita' });
          }

          const body = `La cita ${appointment.type === 'P' ? 'presencial' : 'por videollamada skype'} del próximo ${moment(appointment.date).utc().format('DD/MM/YYYY [a las] HH:mm')} ha sido cancelada`;

          MailController.sendCancelAppointmentNotification(user.email, user.profile.name, body);
          MailController.sendCancelAppointmentNotification('jorgebaztan@dietafarma.es', 'Jorge', body);

          return res.status(204).end();
        });
      }

      return res.status(204).end();
    });
  });
};
