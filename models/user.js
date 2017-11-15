//================================
// User Schema
//================================

const bcrypt                = require('bcrypt');
const mongoose              = require('mongoose');
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
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    enum: [ 'male', 'female' ],
    required: true
  },
  birthday: {
    type: Date,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: 'client'
  },
  phone: String,
  height: String,
  weight: String,
  shapes: String,
  clinicHistory: String,
  foodDiseases: String,
  foodForbidden: String,
  usualDiet: String,
  dayFruit: {
    type: Boolean,
    default: false
  },
  dayMilk: {
    type: Boolean,
    default: false
  },
  dayCereals: {
    type: Boolean,
    default: false
  },
  dayProteins: {
    type: Boolean,
    default: false
  },
  selfCook: {
    type: Boolean,
    default: false
  },
  receiveDietsBefore: {
    type: Boolean,
    default: false
  },
  isEmployed: {
    type: Boolean,
    default: false
  },
  employmentType: String,
  transportType: String,
  activityFrecuency: String,
  injuries: String,
  receiveTrainingInfo: {
    type: Boolean,
    default: false
  },
  receiveSupplementInfo: {
    type: Boolean,
    default: false
  },
  assignedNutritionist: String,
  nextAppointment: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
},
{
  timestamps: true
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
  const user = this;
  const SALT_FACTOR = 10;

  if (!user.isModified('password') && !user.isNew) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function(requestPassword, cb) {
  bcrypt.compare(requestPassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  })
};

module.exports = mongoose.model('User', UserSchema);
