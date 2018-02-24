require('dotenv').config();

const express                   = require('express');
const app                       = express();
const apiRoutes                 = express.Router();
const port                      = process.env.PORT || 4500;

const helmet                    = require('helmet');
const logger                    = require('morgan');
const errorhandler              = require('errorhandler');
const bodyParser                = require('body-parser');
const methodOverride            = require('method-override');
const cors                      = require('cors');
const cookieParser              = require('cookie-parser');
const path                      = require('path');
const Promise                   = require('bluebird');
const mongoose                  = require('mongoose');
const passport                  = require('./config/passport')();

const AuthenticationController  = require('./controllers/auth');
const UserController            = require('./controllers/user');
const AppointmentController     = require('./controllers/appointment');
const MessageController         = require('./controllers/message');
const DietController            = require('./controllers/diet');
const S3Controller              = require('./controllers/s3');

// set up our express application

app.use(helmet());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));

// enable cors
const corsOption = {
  origin: ['http://localhost:4200', 'https://dieta-farma-online.herokuapp.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOption));

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

// Use the passport package config in our application
app.use(passport.initialize());

// Initializing route groups
// =============================================================================
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

// Modify user route (PUT http://localhost:4500/api/users/:id)
apiRoutes.put('/users/:id', UserController.modify);

/**
  //= ========================
  // Appointments Routes
  //= ========================
*/

// Get nutriotionist appointments route (GET http://localhost:4500/api/appointments/calendar)
apiRoutes.get('/appointments/calendar', passport.authenticate(), AppointmentController.getCalendar);

// Get customer appointments route (GET http://localhost:4500/api/appointments/customer)
apiRoutes.get('/appointments/customer', passport.authenticate(), AppointmentController.getCustomer);

// Create user appointment route (POST http://localhost:4500/api/appointments)
apiRoutes.post('/appointments', passport.authenticate(), AppointmentController.create);

// Modify user appointment route (PUT http://localhost:4500/api/appointments/:id)
apiRoutes.put('/appointments/:id', passport.authenticate(), AppointmentController.modify);

// Delete user appointment route (DELETE http://localhost:4500/api/appointments/:id)
apiRoutes.delete('/appointments/:id', passport.authenticate(), AppointmentController.delete);

/**
  //= ========================
  // Messages Routes
  //= ========================
*/

// Get user messages route (GET http://localhost:4500/api/messages)
apiRoutes.get('/messages', passport.authenticate(), MessageController.get);

// Create user message route (POST http://localhost:4500/api/messages)
apiRoutes.post('/messages', passport.authenticate(), MessageController.create);

// Delete user messages route (DELETE http://localhost:4500/api/messages/:id)
apiRoutes.delete('/messages/:id', passport.authenticate(), MessageController.delete);

/**
  //= ========================
  // Diets Routes
  //= ========================
*/

// Get user diets route (GET http://localhost:4500/api/diets)
apiRoutes.get('/diets', passport.authenticate(), DietController.get);

// Create diet route (POST http://localhost:4500/api/diets)
apiRoutes.post('/diets', passport.authenticate(), DietController.create);

// Modify user diets route (PUT http://localhost:4500/api/diets/:id)
apiRoutes.put('/diets/:id', passport.authenticate(), DietController.modify);

// Delete user diets route (DELETE http://localhost:4500/api/diets/:id)
apiRoutes.delete('/diets/:id', passport.authenticate(), DietController.delete);

// Upload files to S3
apiRoutes.post('/signed-request', S3Controller.getUrl);

// View user profile route
// userRoutes.get('/home', requireAuth, AuthenticationController.roleAuthorization(roles.ROLE_CLIENT), UserController.getUserProfile);

// Set url for API group routes
app.use('/api', apiRoutes);

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// set up database

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGOLAB_URI, { useMongoClient: true }); // connect to our database
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${process.env.MONGOLAB_URI}`);
});
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${process.env.MONGOLAB_URI}`);
});

// START THE SERVER
// =============================================================================
app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});

module.exports = app;
