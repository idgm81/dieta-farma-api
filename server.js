const express                   = require('express');
const app                       = express();
const morgan                    = require('morgan');
const bodyParser                = require('body-parser');
const methodOverride            = require('method-override');
const cors                      = require('cors');
const cookieParser              = require('cookie-parser');
const expressValidation         = require('express-validation');
//const router              = require('./router');
const AuthenticationController  = require('./controllers/auth');
const UserController            = require('./controllers/user');
const Promise                   = require('bluebird');
const mongoose                  = require('mongoose');
const { port }                  = require('./config/express');
const database                  = require('./config/database'); // get db config file
const passport                  = require('./config/passport')();

mongoose.Promise = Promise;
mongoose.connect(database.uri, { useMongoClient: true }); // connect to our database
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${database.uri}`);
});
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${database.uri}`);
});


// configure app
app.use(morgan('dev')); // log requests to the console

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// enable cors
const corsOption = {
  origin: ['http://localhost:4200'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOption));

// Use the passport package config in our application
app.use(passport.initialize());

// Import routes to be served
// router(app);

// Initializing route groups
const apiRoutes = express.Router();
//const userRoutes = express.Router();

// home api route (GET http://localhost:4500)
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});


// login auth route (POST http://localhost:4500/api/auth/user)
apiRoutes.post('/auth/user', AuthenticationController.userAuth);

// Reset password route
apiRoutes.post('/auth/reset-password', AuthenticationController.forgotPassword);

// Refresh Token
apiRoutes.post('/auth/refresh_token', AuthenticationController.refreshToken);

/**
  //= ========================
  // User Routes
  //= ========================
*/

// register new user route (POST http://localhost:4500/api/users)
apiRoutes.post('/users', UserController.register);

// Get user profile route (GET http://localhost:4500/api/users/:id)
apiRoutes.get('/users/:id', passport.authenticate(), UserController.get);

// Get users profile route (GET http://localhost:4500/api/users)
apiRoutes.get('/users', passport.authenticate(), UserController.getAll);

// View user profile route
// userRoutes.get('/home', requireAuth, AuthenticationController.roleAuthorization(roles.ROLE_CLIENT), UserController.getUserProfile);

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


// START THE SERVER
// =============================================================================
app.listen(port, () => {
  console.log('process env', process.env);
  console.log(`Node app is running on port ${port}`);
});

module.exports = app;
