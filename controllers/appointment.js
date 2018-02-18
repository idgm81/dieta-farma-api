const Appointment = require('../models/appointment');
const User = require('../models/user');
const moment = require('moment');

module.exports.getCustomer = function(req, res) {
  Appointment.find({ customer: req.query.userId }, (err, appointments) => {
    if (err) {
      return res.status(409).json({ errors: { msg: 'No appointments found for this nutritionist' }});
    }

    return res.status(200).json({ appointments });
  });
};
  
module.exports.getNutriotionist = function(req, res) {
  User.findById(req.query.userId, (err, user) => {
    if (err) {
      return res.status(409).json({ errors: { msg: 'No user found for this ID' }});
    }

    Appointment.find({ nutritionist: user.nutritionist}, (err, appointments) => {
      if (err) {
        return res.status(409).json({ errors: { msg: 'No appointments found for this nutritionist' }});
      }

      const calendar = getCalendar();
      const notBooked = calendar.filter((date) => !parseAppointments(appointments).includes(date));

      return res.status(200).json({ appointments: notBooked });

      function parseAppointments(appointments) {
        return appointments.map((app) => moment(app.date).format());
      }

      function getCalendar() {
        const list = [];
      
        for (let i=0; i<31; i++) {
          const jobDay = moment().add(i, 'day');
          const jobHours = [
            '09:00', '09:30', '10:00', '10:30',
            '11:00', '11:30', '12:00', '12:30',
            '13:00', '13:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30'];

          if (jobDay.get('day') > 0 && jobDay.get('day') < 6) {
            jobHours.forEach((h) => list.push(moment(`${jobDay.format('YYYY-MM-DD')} ${h}`).format()));
          }
        }
      
        return list;
      }
    });
  });
};

module.exports.create = function(req, res, next) {
  User.findById(req.body.customer, (err, user) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No user found for this ID' }});
      return next(err);
    }

    const appointment = {
      customer: user._id,
      nutritionist: user.nutritionist,
      type: req.body.type,
      date: req.body.date
    }

    new Appointment(appointment).save().then((appointment) => {
      res.status(200).json({ appointment });
    }).catch((err) => res.status(409).json({ errors: { msg: `Can not create appointment: ${err}` } }));
  });
};

module.exports.modify = function(req, res, next) {
  Appointment.findByIdAndUpdate(req.params.id, req.body, (err, appointment) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No appointment could be found for this ID.' } });
      return next(err);
    }

    return res.status(200).json({ appointment });
  });
};

module.exports.delete = function(req, res, next) {
  Appointment.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No appointment found with this ID' } });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(409).json({ errors: { msg: 'Can not delete appointment' } });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
