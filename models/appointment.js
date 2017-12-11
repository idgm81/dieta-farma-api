//================================
// Appointment Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const AppointmentSchema = new Schema({
  client: {
    type: String,
    required: true
  },
  nutritionist: {
    type: String,
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
