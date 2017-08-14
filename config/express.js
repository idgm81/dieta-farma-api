const express             = require('express');
const app                 = express();
const morgan              = require('morgan');
const bodyParser          = require('body-parser');
const methodOverride      = require('method-override');
const cors                = require('cors');
const cookieParser        = require('cookie-parser');


// configure app
app.use(morgan('dev')); // log requests to the console

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());

// enable cors
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

app.set('port', (process.env.PORT || 4500)); // set our port

module.exports = app;
