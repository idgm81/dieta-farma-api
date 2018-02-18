//================================
// Appointment Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const AppointmentSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    required: true
  },
  nutritionist: {
    type: Schema.Types.ObjectId,
  },
  type: {
    type: String,
    enum: [ 'P', 'V' ],
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
