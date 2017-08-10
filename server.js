
var mongoose = require('mongoose');

var methodOverride = require('method-override');

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var cors       = require('cors');
var app        = express();
var morgan     = require('morgan');
var mongoose   = require('mongoose');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.set('port', (process.env.PORT || 4500)); // set our port

mongoose.connect('mongodb://dfarma:dfarma@ds035036.mlab.com:35036/dieta-farma-api', { useMongoClient: true }); // connect to our database

var User     = require('./app/models/user');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();


// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:4500/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

require('./app/routes')(router);


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//exports = module.exports = app;
