const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  project_name: {
    type: String,
    ref: "Project",
    required: true
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  },
  assigned_to: { type: String, required: true },
  status_text: String,
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now }
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
