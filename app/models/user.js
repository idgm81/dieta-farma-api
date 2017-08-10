mongoose         = require('mongoose');
var Schema       = mongoose.Schema;

var userSchema = new Schema({
	name: String,
  age: String,
  genre: String,
  role: String,
  email: String,
	password: String
});

module.exports = mongoose.model('user', userSchema);
