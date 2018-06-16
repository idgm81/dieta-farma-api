//================================
// Purchase Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const PurchaseSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [ 'P', 'V', 'O' ],
    required: true
  },
  price: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Purchase', PurchaseSchema);
