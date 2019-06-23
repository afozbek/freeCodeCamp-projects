const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new Schema({
  // TODO
  text: {
    type: String,
    required: true
  },
  thread_id: { type: Schema.Types.ObjectId, ref: "Thread" },
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
