const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  project_name: {
    type: String,
    ref: "Project"
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
  assigned_to: String,
  status_text: String,
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
