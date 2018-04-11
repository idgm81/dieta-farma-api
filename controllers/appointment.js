const Appointment   = require('../models/appointment');
const User          = require('../models/user');
const moment        = require('moment');
const mongoose      = require('mongoose');

module.exports.get = function(req, res) {
  Appointment.aggregate([
    { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customer_data' } },
    { $match: { $or: [{ customer: mongoose.Types.ObjectId(req.query.userId) }, { nutritionist: mongoose.Types.ObjectId(req.query.userId) }] } },
    { $sort: { createdAt: -1 } }])
    .exec((err, appointments) => {

      console.log('<<<<< get appointment', appointments);

      if (err) {
        return res.status(409).json({ error: 'Error al buscar las citas del suario'});
      }

      return res.status(200).json({ items: appointments.filter((a) => {
        return moment.parseZone(a.date).isAfter(moment())
      }) });
    });
};
  
module.exports.getCalendar = function(req, res) {
  User.findById(req.query.userId, (err, user) => {
    if (err) {
      return res.status(409).json({ error: 'Error al buscar las citas del usuario'});
    }

    Appointment.find({ nutritionist: user.nutritionist }, (err, appointments) => {
      if (err) {
        return res.status(409).json({ error: 'Error al buscar el calendario del nutricionista'});
      }

      const calendar = getFlatCalendar();
      const availables = calendar.filter((date) => !parseAppointments(appointments).includes(date));

      return res.status(200).json({ items: formatCalendar(availables) });

      function parseAppointments(appointments) {
        return appointments.map((cita) => {
          console.log('>>>>parseAppointments parsezone',  moment(cita.date).format('YYYY-MM-DD HH:mm'));

          return moment.parseZone(cita.date).format('YYYY-MM-DD HH:mm');
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

module.exports.create = function(req, res, next) {
  User.findById(req.body.customer, (err, user) => {
    if (err) {
      res.status(409).json({ error: 'Error al buscar el cliente de la cita' });
      return next(err);
    }

    const appointment = {
      customer: user._id,
      nutritionist: user.nutritionist,
      type: req.body.type,
      date: req.body.date
    };

    console.log('>>>>> post appointment', appointment);

    new Appointment(appointment).save().then((appointment) => {
      console.log('<<<<< post appointment', appointment);

      res.status(200).json({ appointment });
    }).catch(() => res.status(409).json({ error: 'Error al reservar la cita' }));
  });
};

module.exports.modify = function(req, res, next) {
  Appointment.findByIdAndUpdate(req.params.id, req.body, (err, appointment) => {
    if (err) {
      res.status(409).json({ error: 'Error al modificar la cita' });
      return next(err);
    }

    return res.status(200).json({ appointment });
  });
};

module.exports.delete = function(req, res, next) {
  Appointment.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(409).json({ error: 'Error al borrar la cita' });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(409).json({ error: 'Error al borrar la cita' });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
