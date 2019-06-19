const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  project_name: {
    type: String,
    unique: true,
    required: true
  },
  project_desc: String,
  contributors: [String],
  created_by: String,
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
