var User = require('../models/user');
module.exports.getAllUsers = function (req, res) {
    User.find({}, function (err, docs) {
        if (err) res.send(err)
        res.send({
            user: docs
        });
    });
};
module.exports.getUserId = function (req, res) {
    User.findById(req.params.user_id, function (err, docs) {
        if (err) res.send(err);
        res.send({
            user: docs
        });
    });
};
module.exports.deleteUser = function (req, res) {
    User.findById(req.params.user_id, function (err, elem) {
        if (err) res.send(err);
        elem.remove(function (err, docs) {
            if (err) res.send(err);
            res.send({
                user: docs
            });
        });
    });
};
module.exports.addUser = function (req, res) {
    var user = new User(req.body.user);
    user.save(function (err, elem) {
        if (err) res.send(err);
        res.send({
            user: elem
        });
    });
};
module.exports.modifyUser = function (req, res) {
    User.findByIdAndUpdate(req.params.user_id, {
        $set: req.body.user
    }, function (err, elem) {
        if (err) res.send(err);
        res.send({
            user: elem
        });
    });
};
