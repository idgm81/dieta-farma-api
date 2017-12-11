const Appointment = require('../models/appointment');

module.exports.get = function(req, res) {
  Appointment.find({$or: [{ client: req.params.id }, { nutritionist: req.params.id }]}, (err, appointments) => {
    if (err) {
      return res.status(409).json({ errors: 'No appointments found for this ID' });
    }

    return res.status(200).json({ appointments });
  });
};

module.exports.create = function(req, res, next) {
  const newAppointment = new Appointment(req.body);

  newAppointment.save().then((appointment) =>
    res.status(200).json({ appointment })
  ).catch((err) => {
    return next(err);
  });
};

module.exports.modify = function(req, res, next) {
  Appointment.update({ _id: req.params.id }, req.body.user, (err, appointment) => {
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
