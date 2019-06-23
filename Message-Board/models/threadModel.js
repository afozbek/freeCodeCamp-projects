const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const threadSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    board_name: String,
    delete_password: {
      type: String,
      required: true,
      unique: true
    },
    replies: {
      type: [Object]
    },
    reported: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("Thread", threadSchema);
