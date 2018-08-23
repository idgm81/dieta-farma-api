require('dotenv').config();

const express                   = require('express');
const swStats                   = require('swagger-stats');   
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
const ThreadController          = require('./controllers/thread');
const DietController            = require('./controllers/diet');
const S3Controller              = require('./controllers/s3');
const PurchaseController        = require('./controllers/purchase');

// set up our express application

app.use(helmet());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));
app.use(swStats.getMiddleware({}));

// enable cors
const corsOption = {
  origin: ['http://localhost:4200', 'https://dieta-farma-online.herokuapp.com', 'https://beta-dieta-farma-online.herokuapp.com'],
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

// Reset password route (POST http://localhost:4500/api/auth/modifyPassword)
apiRoutes.post('/auth/modifyPassword', AuthenticationController.modifyPassword);

// Refresh Token
apiRoutes.post('/auth/refreshToken', AuthenticationController.refreshToken);

// Check email (GET http://localhost:4500/api/auth/checkEmail?email=:email)
apiRoutes.get('/auth/checkEmail', AuthenticationController.checkEmail);

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
apiRoutes.put('/users/:id', passport.authenticate(), UserController.modify);

// Delte user route (DELETE http://localhost:4500/api/users/:id)
apiRoutes.delete('/users/:id', passport.authenticate(), UserController.delete);

/**
  //= ========================
  // Appointments Routes
  //= ========================
*/

// Get nutritionist appointments route (GET http://localhost:4500/api/appointments/calendar)
apiRoutes.get('/appointments/calendar', passport.authenticate(), AppointmentController.getCalendar);

// Get appointments route (GET http://localhost:4500/api/appointments?userId=)
apiRoutes.get('/appointments', passport.authenticate(), AppointmentController.get);

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

// Get user messages route (GET http://localhost:4500/api/threads?userId=:userId)
apiRoutes.get('/threads', passport.authenticate(), ThreadController.get);

// Create user message route (POST http://localhost:4500/api/threads)
apiRoutes.post('/threads', passport.authenticate(), ThreadController.create);

// Create user message route (POST http://localhost:4500/api/threads/:id)
apiRoutes.put('/threads/:id', passport.authenticate(), ThreadController.modify);

// Delete user messages route (DELETE http://localhost:4500/api/threads/:id)
apiRoutes.delete('/threads/:id', passport.authenticate(), ThreadController.delete);

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

/**
  //= ========================
  // Purchases Routes
  //= ========================
*/

// Get purchases route (GET http://localhost:4500/api/purchases?userId=)
// apiRoutes.get('/purchases', passport.authenticate(), PurchaseController.get);

// Create new purchase route (POST http://localhost:4500/api/purchases
apiRoutes.post('/purchases', passport.authenticate(), PurchaseController.create);

// Delete purchase route (DELETE http://localhost:4500/api/purchases/:id)
// apiRoutes.delete('/purchases/:id', passport.authenticate(), PurchaseController.delete);


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
