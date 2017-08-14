const app = require('./config/express');
const router = require('./router');
const mongoose   = require('mongoose');
const db = process.env.MONGOLAB_URI || 'mongodb://localhost/dieta-farma-api';

mongoose.connect(db, { useMongoClient: true }); // connect to our database
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${db}`);
});
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${db}`);
});


// Import routes to be served
router(app);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), () => {
  console.log(`Node app is running on port ${app.get('port')}`);
});

module.exports = app;
