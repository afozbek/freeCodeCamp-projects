const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    thread_id: { type: Schema.Types.ObjectId, ref: "Thread" },
    delete_password: {
      type: String,
      required: true
    },
    reported: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
