const express = require('express');
const passport = require('passport');
const expressValidation   = require('express-validation');
const AuthenticationController = require('./controllers/auth');
const UserController = require('./controllers/user');

const { roles } = require('./constants');

const passportService = require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  const userRoutes = express.Router();

  //= ========================
  // Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Password reset request route (generate/send token)
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // Password reset route (change password using token)
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);


  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/home', requireAuth, AuthenticationController.roleAuthorization(roles.ROLE_CLIENT), UserController.getUserProfile);

  //= ========================
  // Admin Routes
  //= ========================

  apiRoutes.get('/admin', requireAuth, AuthenticationController.roleAuthorization(roles.ROLE_ADMIN), (req, res) => {
    res.status(200).json({ content: 'Admin dashboard is working.' });

  });

  // Set url for API group routes
  app.use('/api', apiRoutes);

  app.use((err, req, res, next) => {
    if (err instanceof expressValidation.ValidationError) {
      res.status(err.status).json(err);
    } else {
      res.status(500)
        .json({
          status: err.status,
          message: err.message
        });
    }
  });
};
