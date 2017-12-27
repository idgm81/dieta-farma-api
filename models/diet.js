//================================
// Diet Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const DietSchema = new Schema({
  title: {
    type: String,
    required: true
  },
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
  url: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Diet', DietSchema);
