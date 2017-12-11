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
  role: {
    type: String,
    required: true,
    default: 'C'
  },
  nutritionist: Number,
  profile: {
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
    phone: {
      type: String,
    },
    measures: {
      height: String,
      weight: String,
      imc: String,
      fat: String,
      water: String,
      mass: String,
      biotype: String,
      boneMass: String,
      metabolicExpense: String,
      metabolicAge: String,
      visceralFat: String,
      segments: {
        arm: {
          left: {
            fatPercentage: String,
            mass: String
          },
          right: {
            fatPercentage: String,
            mass: String
          }
        },
        leg: {
          left: {
            fatPercentage: String,
            mass: String
          },
          right: {
            fatPercentage: String,
            mass: String
          }
        },
        trunk: {
          fatPercentage: String,
          mass: String
        }
      },
      shapes: {
        waist: String,
        wrist: String,
        hip: String,
        arm: String,
        leg: String,
        chest: String
      },
      creases: {
        bicipital: String,
        tricipital: String,
        subescapular: String,
        suprailiaco: String
      },
    },
    objective: String,
    reason: String,
    foodDiseases: String,
    foodFavourite: String,
    foodForbidden: String,
    dietType: String,
    dayFruit: String,
    dayMilk: String,
    dayCereals: String,
    dayProteins: String,
    selfCook: {
      type: Boolean,
      default: false
    },
    receiveDietsBefore: {
      type: Boolean,
      default: false
    },
    supervisor: String,
    supervisorDetail: String,
    isEmployed: {
      type: Boolean,
      default: false
    },
    employmentType: String,
    transportType: String,
    doExercise: {
      type: Boolean,
      default: false
    },
    exerciseFrecuency: String,
    increaseActivity: {
      type: Boolean,
      default: false
    },
    injuries: String,
    receiveTrainingInfo: {
      type: Boolean,
      default: false
    },
    receiveSupplementInfo: {
      type: Boolean,
      default: false
    },
    appointments: [],
    diets: [],
    resetPasswordToken: String,
    resetPasswordExpires: Date
  }
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
