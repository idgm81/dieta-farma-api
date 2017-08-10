// app/router.js

var userAPI = require('./api/user');
module.exports = function (router) {

    router.route('/users')
        .get(function (req, res) {
            userAPI.getAllUsers(req, res)
        })
        .post(function (req, res) {
            userAPI.addUser(req, res)
        });
    router.route('/users/:user_id')
        .get(function (req, res) {
            userAPI.getUserId(req, res)
        })
        .delete(function (req, res) {
            userAPI.deleteUser(req, res)
        })
        .patch(function (req, res) {
            userAPI.modifyUser(req, res)
        });
};
