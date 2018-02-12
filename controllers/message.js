const Message                   = require('../models/message');
const User                      = require('../models/user');
const MailController            = require('./mail');

module.exports.get = function(req, res) {
  Message.find({ to: req.query.userId }, null, { sort: '-createdAt'}, (err, messages) => {
    if (err) {
      return res.status(409).json({ errors: 'No message found with this ID' });
    }

    return res.status(200).json({ messages });
  });
};

module.exports.create = function(req, res, next) {
  const body = req.body;
  let newMessage = null;

  if (req.body.to === undefined) {
    User.findById(req.body.from).then((userFrom) => {
      body.to = userFrom.nutritionist;

      User.findById(req.body.to).then((userTo) => {

        newMessage = new Message(body);

        return newMessage.save().then((message) => {
          MailController.sendMessageNotification(userFrom, userTo, message);

          return res.status(200).json({ message });
        }).catch((err) => {
          return next(err);
        });
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => {
      return next(err);
    });
  } else {

    Promise.all([User.findById(req.body.from), User.findById(req.body.to)]).then((users) => {
      newMessage = new Message(body);

      return newMessage.save().then((message) => {
        MailController.sendMessageNotification(users[0], users[1], message);

        return res.status(200).json({ message });
      }).catch((err) => {
        return next(err);
      });
    });
  }
};

module.exports.delete = function(req, res, next) {
  Message.findById(req.params.id, (err, user) => {
    if (err) {
      res.status(409).json({ errors: { msg: 'No message found with this ID' } });
      return next(err);
    }
    user.remove((err) => {
      if (err) {
        res.status(409).json({ errors: { msg: 'Can not delete message' } });
        return next(err);
      }

      return res.status(204).end();
    });
  });
};
