const Message                   = require('../models/message');
const User                      = require('../models/user');
const MailController            = require('./mail');

module.exports.get = function(req, res) {
  Message.find({$or: [{ client: req.query.userId }, { nutritionist: req.query.userId}]}, (err, messages) => {
    if (err) {
      return res.status(409).json({ errors: 'No message found with this ID' });
    }

    return res.status(200).json({ messages });
  });
};

module.exports.create = function(req, res, next) {
  const message = req.body;

  User.findById(req.body.client).then((user) => {
    message.nutritionist = user.nutritionist;

    const newMessage = new Message(message);

    return newMessage.save().then((message) => {

      User.findByIdAndUpdate(req.body.client, { $push: { 'profile.messages': message._id } }, (err, user) => {
        if (err) {
          res.status(409).json({ errors: { msg: 'Can not send message' } });
          return next(err);
        }

        MailController.sendMessageNotification(user);

        return res.status(200).json({ message });
      });
    }).catch((err) => {
      return next(err);
    });
  }).catch((err) => {
    return next(err);
  });
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
