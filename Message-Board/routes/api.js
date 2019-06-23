"use strict";

var expect = require("chai").expect;
const bcrypt = require("bcrypt");

const Thread = require("../models/threadModel");
const Reply = require("../models/replyModel");

const SALT_ROUNDS = 10;

module.exports = function(app) {
  // Threads
  app
    .route("/api/threads/:board")
    .get(async (req, res, next) => {
      try {
        const threads = await Thread.find({ board_name: req.params.board })
          .select("-delete_password -__v -reported")
          .limit(10);
        if (!threads) {
          return res.send("Cant retrieve threads");
        }
        return res.json(threads);
      } catch (err) {
        return next(new Error("Cannot get Threads"));
      }
    }) // Okey
    .post(async (req, res, next) => {
      const { text, delete_password } = req.body;
      let board_name = req.params.board;
      try {
        const hashedPassword = await bcrypt.hash(delete_password, SALT_ROUNDS);

        const newThread = new Thread({
          text,
          delete_password: hashedPassword,
          board_name,
          replies: [],
          reported: false
        });
        let result = await newThread.save();
        console.log(result);
        return res.redirect(`/b/${board_name}`);
      } catch (err) {
        return next(new Error("Something bad happen when posting thread"));
      }
    }) // Okey
    .put(async (req, res, next) => {
      try {
        const result = await Thread.findByIdAndUpdate(
          req.body.thread_id,
          {
            reported: true
          },
          { new: true }
        );
        res.json({ isReported: result.reporteds, status: "success" });
      } catch (err) {
        return next(new Error("error while Updating"));
      }
    }) // Okey
    .delete(async (req, res, next) => {
      try {
        const { thread_id, delete_password } = req.body;
        const thread = await Thread.findById(thread_id);
        if (!thread) {
          return res.send("No thread to delete");
        }
        const isEqual = await bcrypt.compare(
          delete_password,
          thread.delete_password
        );
        console.log("TCL: isEqual", isEqual);
        if (isEqual) {
          await Thread.findByIdAndDelete(thread_id);
          return res.send("Delete successfull");
        }
        return res.send("Password was wrong");
      } catch (err) {
        return next(new Error("Error when deleting thread"));
      }
    }); // Okey

  // Replies
  app
    .route("/api/replies/:board")
    .get(async (req, res, next) => {
      let { thread_id } = req.query;
      if (!thread_id) {
        return next(new Error("No thread id"));
      }
      try {
        const threads = await Thread.find({
          board_name: req.param.board
        }).select("-delete_password -__v -reported");
        if (!threads) {
          return next(new Error("No threads exist"));
        }
        return res.json({ message: "Yep we got the threads", threads });
      } catch (err) {
        return next(new Error("Error when getting boar"));
      }
    })
    .post(async (req, res, next) => {})
    .put(async (req, res, next) => {})
    .delete(async (req, res, next) => {
      try {
        const result = await Reply.findOne({
          _id: req.body.thread_id,
          delete_password: req.body.delete_password
        });
        result.text = "[Deleted]";

        await result.save();
        console.log("Deleted result", result);

        //TODO
        res.redirect(`/b/${req.params.board}`);
      } catch (err) {
        return next(new Error("Error when deleting thread"));
      }
    });
};
