const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new Schema({
  text: {
    type: String,
    required: true
  },
  delete_password: {
    type: String,
    required: true,
    unique: true
  },
  replies: {
    type: [String]
  },
  created_on: { type: Date, default: Date.now },
  reported: Boolean
});

module.exports = mongoose.model("Reply", replySchema);
