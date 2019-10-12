const MailController    = require('./mail');
const User              = require('../models/user');
const stripe            = require('stripe')(process.env.STRIPE_SECRET_KEY);

const generate_payment_response = (intent) => {
  if (
    ['requires_source_action', 'requires__action'].includes(intent.status) &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === 'succeeded') {

    return { success: true };
  } else {
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
};

module.exports.create = function(req, res) {
  if (req.query.free) {
    return User.findById(req.body.customer).then((user) => {
      MailController.sendPurchaseNotification(user, req.body.description);
      MailController.sendPurchaseCustomerNotification(user, req.body.description);

      return res.status(204).end();
    });
  }

  if (req.body.payment_method_id) {
    return stripe.paymentIntents.create({
      payment_method: req.body.payment_method_id,
      amount: req.body.amount,
      currency: 'eur',
      confirmation_method: 'manual',
      receipt_email: req.body.email,
      description: req.body.description,
      metadata: {
        customer_id: req.body.customer
      },
      confirm: true
    }).then((intent) => {
      return User.findById(req.body.customer).then((user) => {
        MailController.sendPurchaseNotification(user, req.body.description);
        MailController.sendPurchaseCustomerNotification(user, req.body.description);

        return res.status(200).json(generate_payment_response(intent));
      });
    }).catch((error) => {
      MailController.sendPurchaseErrorNotification(req.body.email, error);

      return res.status(409).json({ error });
    });
  } else if (req.body.payment_intent_id) {
    return stripe.paymentIntents.confirm(req.body.payment_intent_id)
      .then((intent) => res.status(200).json(generate_payment_response(intent)));
  }
};
