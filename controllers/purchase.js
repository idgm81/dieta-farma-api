const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.create = function(req, res) {
  stripe.charges.create({
    source: req.body.token.id,
    receipt_email: req.body.email,
    amount: req.body.amount,
    currency: 'eur',
    metadata: {
      customer_id: req.body.customer
    }
  }).then((charge) => {
    return res.status(200).json({ charge });
  }).catch((error) => {
    return res.status(409).json({ error });
  });
};
