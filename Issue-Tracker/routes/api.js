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
  // app.post("/api/project", async (req, res) => {
  //   console.log("I am posting...");
  //   console.log(req.body);
  //   let newProject = new Project({
  //     project_name: req.body.project_name,
  //     project_desc: req.body.project_desc,
  //     contributors: ["Furkan Ozbek", "Sena Modanlıoglu"],
  //     created_by: req.body.created_by
  //   });

  //   let result = await newProject.save();

  //   res.send("Success");
  // });

  app
    .route("/api/issues/:project")
    .get(async (req, res, next) => {
      // TODO
      var project = req.params.project;
    })

    .post(async (req, res, next) => {
      let project_name = req.params.project;
      console.log(project_name);
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

    .put(function(req, res) {
      // TODO
      var project = req.params.project;
    })

    .delete(function(req, res) {
      // TODO
      var project = req.params.project;
    });

  app.route("/report-xss-violation").get((req, res) => {
    res.send("We have a xss violation");
  });
};
