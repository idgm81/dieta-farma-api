const express                   = require('express');
const app                       = express();
const morgan                    = require('morgan');
const bodyParser                = require('body-parser');
const methodOverride            = require('method-override');
const cors                      = require('cors');
const cookieParser              = require('cookie-parser');
const expressValidation         = require('express-validation');
const AuthenticationController  = require('./controllers/auth');
const UserController            = require('./controllers/user');
const AppointmentController     = require('./controllers/appointment');
const MessageController         = require('./controllers/message');
const DietController            = require('./controllers/diet');
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
  origin: ['http://localhost:4200', 'https://dieta-farma-online.herokuapp.com'],
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
apiRoutes.post('/auth/reset_password', AuthenticationController.forgotPassword);

// Refresh Token
apiRoutes.post('/auth/refresh_token', AuthenticationController.refreshToken);

/**
  //= ========================
  // User Routes
  //= ========================
*/

// Get all users route (GET http://localhost:4500/api/users?role=:role)
apiRoutes.get('/users', passport.authenticate(), UserController.getAll);

// Get user info route (GET http://localhost:4500/api/users/:id)
apiRoutes.get('/users/:id', passport.authenticate(), UserController.get);

// Create new user route (POST http://localhost:4500/api/users)
apiRoutes.post('/users', UserController.create);

// Modify user route (POST http://localhost:4500/api/users)
apiRoutes.put('/users/:id', UserController.modify);

/**
  //= ========================
  // Appointments Routes
  //= ========================
*/

// Get user appointments route (GET http://localhost:4500/api/appointments/:id)
apiRoutes.get('/appointments/:id', passport.authenticate(), AppointmentController.get);

// Create user appointment route (POST http://localhost:4500/api/appointments)
apiRoutes.post('/appointments?id=:id', passport.authenticate(), AppointmentController.create);

// Modify user appointment route (PUT http://localhost:4500/api/appointments/:appointmentId/?id=:id)
apiRoutes.put('/appointments/:appointmentId/?id=:id', passport.authenticate(), AppointmentController.modify);

// Delete user appointment route (PUT http://localhost:4500/api/appointments/:appointmentId)
apiRoutes.delete('/appointments/:appointmentId', passport.authenticate(), AppointmentController.delete);

/**
  //= ========================
  // Messages Routes
  //= ========================
*/

// Get user messages route (GET http://localhost:4500/api/messages/:id)
apiRoutes.get('/messages/:id', passport.authenticate(), MessageController.get);

// Create user message route (POST http://localhost:4500/api/messages?id=:id)
apiRoutes.post('/messages?id=:id', passport.authenticate(), MessageController.create);

// Delete user messages route (DELETE http://localhost:4500/api/messages/:messageId)
apiRoutes.delete('/messages/:messageId', passport.authenticate(), MessageController.delete);

/**
  //= ========================
  // Diets Routes
  //= ========================
*/

// Get user diets route (GET http://localhost:4500/api/diets/:id)
apiRoutes.get('/diets/:id', passport.authenticate(), DietController.get);

// Create diet route (POST http://localhost:4500/api/diets?id=:id)
apiRoutes.post('/diets?id=:id', passport.authenticate(), DietController.create);

// Modify user diets route (PUT http://localhost:4500/api/diets/:dietId/?id=:id)
apiRoutes.put('/diets/:dietId/?id=:id', passport.authenticate(), DietController.modify);

// Delete user diets route (DELETE http://localhost:4500/api/diets/:dietId)
apiRoutes.delete('/diets/:dietId', passport.authenticate(), DietController.delete);


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
  console.log(`Node app is running on port ${port}`);
});

module.exports = app;
