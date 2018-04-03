//================================
// Thread Schema
//================================

const mongoose              = require('mongoose');
const Schema                = mongoose.Schema;

const MessageSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  text: String
}, {
  timestamps: true
});

const ThreadSchema = new Schema({
  title: String,
  nutritionist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  messages: [ MessageSchema ],
  unread: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Thread', ThreadSchema);
