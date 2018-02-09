//================================
// Message Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const MessageSchema = new Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  title: String,
  text: String,
  unread: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Message', MessageSchema);
