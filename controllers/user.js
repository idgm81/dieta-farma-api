const User = require('../models/user');

//= =======================================
// User Routes
//= =======================================
module.exports.getUserProfile = function(req, res, next) {
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) { return res.status(401).json({ error: 'You are not authorized to view this user profile.' }); }
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(409).json({ error: 'No user could be found for this ID.' });
      return next(err);
    }

    return res.status(200).json({ user });
  });
};

module.exports.getAllUsers = function(req, res) {
    User.find({}, (err, users) => {
      if (err) {
        res.status(409).json({ error: 'No users could be found' });
        return next(err);
      }

      return res.status(200).json({ users });
    });
};

module.exports.deleteUser = function(req, res) {
    User.findById(req.params.user_id, (err, user) => {
      if (err) {
        res.status(409).json({ error: 'No user could be found for this ID.' });
        return next(err);
      }
      user.remove((err, user) => {
        if (err) {
          res.status(403).json({ error: 'Can not remove user' });
          return next(err);
        }

        return res.status(204).end();
      });
    });
};
