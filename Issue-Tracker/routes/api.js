/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
// var MongoClient = require("mongodb");
// var ObjectId = require("mongodb").ObjectID;

const Project = require("../models/projectModel");
const Issue = require("../models/issueModel");

module.exports = function(app) {
  app.post("/api/project", async (req, res) => {
    console.log("I am posting...");
    console.log(req.body);
    let newProject = new Project({
      project_name: req.body.project_name,
      project_desc: req.body.project_desc,
      contributors: ["Furkan Ozbek", "Sena Modanlıoglu"],
      created_by: req.body.created_by
    });

    let result = await newProject.save();

    res.send("Success");
  });

  app
    .route("/api/issues/:project")
    .get(async (req, res, next) => {
      var project_name = req.params.project;

      let { open, assigned_to } = req.query;
      console.log(req.query);
      let findParam;

      if (open && assigned_to) {
        findParam = { open, assigned_to };
      } else if (open) {
        let bool = open === "true" ? true : false;
        findParam = { open: bool };
      } else if (assigned_to) {
        findParam = { assigned_to };
      } else {
        findParam = (err, res) => {};
      }
      try {
        let project = Project.findOne({ project_name });
        if (!project) {
          let err = new Error("Project name is not exists");
          return next(err);
        }
        let issues = await Issue.find(findParam);

        res.json(issues);
      } catch (err) {
        next(err);
      }
    })

    .post(async (req, res, next) => {
      let project_name = req.params.project;
      console.log(project_name);
      console.log(req.body);
      try {
        const project = await Project.findOne({ project_name });
        if (!project) {
          let error = new Error("Project doesn't exist");
          return next(error);
        } else {
          let {
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text
          } = req.body;
          if (!issue_title || !issue_text || !created_by || !assigned_to) {
            let error = new Error("Please fill required fields");
            return next(error);
          }
          const issue = new Issue({
            issue_title,
            issue_text,
            created_by,
            project_name,
            assigned_to,
            status_text,
            open: true
          });

          const result = await issue.save();
          res.json(result);
        }
      } catch (err) {
        next(err);
      }
    })

    .put(async (req, res, next) => {
      // TODO
      console.log(req.body);
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
      try {
        let project_name = await Project.findOne({
          project_name: req.params.project
        });
        if (!project_name) {
          console.log("Project doesnt exist");
          return res.json({
            message: "Cannot update" + req.body._id
          });
        }

        const prevIssue = await Issue.findById(req.body._id);
        prevIssue.issue_title = issue_title;
        prevIssue.issue_text = issue_text;
        prevIssue.created_by = created_by;
        prevIssue.assigned_to = assigned_to;
        prevIssue.status_text = status_text;
        prevIssue.updated_on = Date.now();

        const result = await prevIssue.save();
        console.log("Result", result);
        return res.json({
          message: "Successfully updated",
          updated_on: result.updated_on
        });
      } catch (err) {
        err = new Error("could not update " + req.body._id);
        return next(err);
      }
    })

    .delete(async (req, res, next) => {
      try {
        let project_name = await Project.findOne({
          project_name: req.params.project
        });
        if (!project_name) {
          console.log("Project doesnt exist");
          return res.json({
            message: "Cannot update" + req.body._id
          });
        }

        let result = await Issue.findByIdAndDelete(req.body._id);

        console.log("Result", result);
        return res.json({
          message: "Successfully deleted",
          _id: result._id
        });
      } catch (err) {
        err = new Error("could not delete " + req.body._id);
        return next(err);
      }
    });

  app.route("/report-xss-violation").get((req, res) => {
    res.send("We have a xss violation");
  });
};
