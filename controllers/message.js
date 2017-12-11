const Message = require('../models/message');

module.exports.get = function(req, res) {
  Message.find({$or: [{ client: req.params.id }, { nutritionist: req.params.id }]}, (err, message) => {
    if (err) {
      return res.status(409).json({ errors: 'No message found with this ID' });
    }

    return res.status(200).json({ message });
  });
};

module.exports.create = function(req, res, next) {
  const newMessage = new Message(req.body);

  newMessage.save().then((message) =>
    res.status(200).json({ message })
  ).catch((err) => {
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
