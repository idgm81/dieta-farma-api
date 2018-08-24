const MailController    = require('./mail');
const User              = require('../models/user');
const stripe            = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.create = function(req, res) {
  stripe.charges.create({
    source: req.body.token,
    receipt_email: req.body.email,
    amount: req.body.amount,
    description: req.body.description,
    currency: 'eur',
    metadata: {
      customer_id: req.body.customer
    }
  }).then((charge) => {
    return User.findById(req.body.customer).then((user) => {
      MailController.sendPurchaseNotification(user, req.body.description);

      return res.status(200).json({ charge });
    });
  }).catch((error) => {
    return res.status(409).json({ error });
  });
};
