//================================
// User Schema
//================================

const bcrypt   		 					= require('bcrypt');
const mongoose							= require('mongoose');
const { roles }             = require('../constants');
const Schema                = mongoose.Schema;


const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    firstName: { type: String },
    lastName: { type: String },
    genre: {
      type: String,
      enum: ['male', 'female'],
      default: 'male'
    },
    age: { type: String}
  },
  role: {
    type: String,
    enum: [ roles.ROLE_CLIENT, roles.ROLE_NUTRIOTIONIST, roles.ROLE_ADMIN ],
    default: roles.ROLE_CLIENT
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
},
{
  timestamps: true
});


// methods ======================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const user = this;
  const SALT_FACTOR = 10;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  })
};

module.exports = mongoose.model('User', UserSchema);
