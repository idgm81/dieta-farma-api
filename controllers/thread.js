const Thread          = require('../models/thread');
const User            = require('../models/user');
const MailController  = require('./mail');
const mongoose        = require('mongoose');
const moment          = require('moment');

module.exports.get = function(req, res) {
  Thread.aggregate([
    { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customer_data' } },
    { $lookup: { from: 'users', localField: 'nutritionist', foreignField: '_id', as: 'nutritionist_data' } },
    { $match: { $or: [{ customer: mongoose.Types.ObjectId(req.query.userId) }, { nutritionist: mongoose.Types.ObjectId(req.query.userId) }] } },
    { $sort: { createdAt: -1 } }])
    .exec((err, threads) => {
      if (err) {
        return res.status(409).json({ error: 'Error al recuperar los mensajes del usuario' });
      }

      return res.status(200).json({ threads });
    });
};

module.exports.create = function(req, res) {
  return User.findById(req.body.from).then((userFrom) => {
    if (!userFrom) {
      return res.status(409).json({ error: 'Usuario destinatario no encontrado' }); 
    }

    const target = userFrom.role === 'C' ? userFrom.nutritionist : req.body.to;

    return User.findById(target).then((userTo) => {
      const newThread = new Thread({
        nutritionist: userFrom.role === 'N' ? userFrom._id : userTo._id,
        customer: userFrom.role === 'N' ? userTo._id : userFrom._id,
        date: moment().parseZone(),
        title: req.body.title,
        messages: [{
          author: userFrom._id,
          date: moment().parseZone(),
          text: req.body.text,
        }]
      });

      return newThread.save().then((thread) => {
        MailController.sendMessageNotification(userFrom, userTo);

        return res.status(204).json({ _id: thread._id });
      }).catch(() => {
        return res.status(409).json({ error: 'Error al guardar el mensaje' });
      });
    }).catch(() => {
      return res.status(409).json({ error: 'Usuario destinatario no encontrado' });
    });
  }).catch(() => {
    return res.status(409).json({ error: 'Usuario remitente no encontrado' });
  });
};

module.exports.modify = function(req, res) {
  Thread.findById(req.params.id).then((thread) => {
    const author = req.body.author;
    const message = {
      author,
      date: moment().parseZone(),
      text: req.body.text
    };

    return thread.update({
      $push: { messages: message },
      $set: { unread: false } })
      .then(() => User.findById(author))
      .then((userFrom) => {
        return User.findById(thread.customer).then((userTo) => {
          MailController.sendMessageNotification(userFrom, userTo);

          return res.status(204).end();
        })
      }).catch(() => res.status(409).json({ error: 'Error al enviar el mensaje' }))
  }).catch(() => res.status(409).json({ error: 'Conversación no encontrada' }));
};

module.exports.delete = function(req, res) {
  Thread.findById(req.params.id, (err, user) => {
    if (err || !user) {
      return res.status(409).json({ error: 'Conversación no encontrada' });
    }

    user.remove((err) => {
      if (err) {
        return res.status(409).json({ error: 'Error al borrar la conversación'});
      }

      return res.status(204).end();
    });
  });
};
