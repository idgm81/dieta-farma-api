const passport      = require('passport');
const JwtStrategy   = require('passport-jwt').Strategy;
const ExtractJwt    = require('passport-jwt').ExtractJwt;
const jwToken       = require('jsonwebtoken');
const User          = require('../models/user');
const config = {
  secret: process.env.SECRET_KEY || '7rm$rkc1svg=!ldzg9da*-vo9o9ael(lh2u&3+sb5-ix@31*v#',
  expirationTime: 60 * 5, // 5 minutes
  jwtSession: {
    session: false
  }
};

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
};

module.exports = function() {
  var strategy = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload.id, (err, user) => {
      if (err) { return done(err, false); }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });
  passport.use(strategy);
  return {
    generateToken: function(payload) {
      const token = jwToken.sign(payload, config.secret, { expiresIn: 60 * 5 });

      return {
        id: payload.id,
        role: payload.role,
        token,
        exp: config.expirationTime
      }
    },
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate('jwt', config.jwtSession);
    }
  };
};
