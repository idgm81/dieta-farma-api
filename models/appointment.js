//================================
// Appointment Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const AppointmentSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nutritionist: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [ 'P', 'L', 'V' ],
    required: true
  },
  date: {
    type: Date,
    required: true
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Appointment', AppointmentSchema);
