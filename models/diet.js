//================================
// Diet Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const DietSchema = new Schema({
  client: {
    type: String,
    required: true
  },
  nutritionist: {
    type: String,
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  detail: String
},
{
  timestamps: true
});

module.exports = mongoose.model('Diet', DietSchema);
