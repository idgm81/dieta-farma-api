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
  type:  {
    type: String,
    enum: [ 'D', 'P' ],
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  nutritionist: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
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
}, {
  timestamps: true
});

module.exports = mongoose.model('Diet', DietSchema);
