"use strict";

var expect = require("chai").expect;
const Thread = require("../models/threadModel");
const Reply = require("../models/replyModel");

module.exports = function(app) {
  // Threads
  app
    .route("/api/threads/:board")
    .get(async (req, res, next) => {})
    .post(async (req, res, next) => {})
    .put(async (req, res, next) => {})
    .delete(async (req, res, next) => {});

  // Replies
  app
    .route("/api/replies/:board")
    .get(async (req, res, next) => {})
    .post(async (req, res, next) => {})
    .put(async (req, res, next) => {})
    .delete(async (req, res, next) => {});
};
