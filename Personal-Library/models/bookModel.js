const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  comments: [String],
  num_of_comments: { type: Number, default: 0 }
});

module.exports = mongoose.model("Book", bookSchema);
