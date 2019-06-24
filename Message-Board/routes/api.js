"use strict";

var expect = require("chai").expect;
const bcrypt = require("bcrypt");

const Thread = require("../models/threadModel");
const Reply = require("../models/replyModel");

const mongoose = require("mongoose");

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
        await newThread.save();
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
          _id: thread_id,
          board_name: req.params.board
        }).select("-delete_password -__v -reported");
        console.log(threads);
        if (!threads) {
          return next(new Error("No threads exist"));
        }
        return res.json({ message: "Yep we got the threads", threads });
      } catch (err) {
        return next(new Error("Error when getting thread"));
      }
    }) // Okey
    .post(async (req, res, next) => {
      const { text, delete_password, thread_id } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(delete_password, SALT_ROUNDS);

        if (!hashedPassword) {
          return next(new Error("Cannot hash password"));
        }

        const newReply = new Reply({
          text,
          delete_password: hashedPassword,
          reported: false,
          thread_id
        });
        const resultReply = await newReply.save();

        if (!resultReply) {
          return next(new Error("Error when creating reply"));
        }

        await Thread.findByIdAndUpdate(
          thread_id,
          {
            $push: {
              replies: {
                _id: resultReply._id,
                text,
                delete_password: resultReply.delete_password,
                reported: resultReply.reported,
                created_on: resultReply.createdAt
              }
            }
          },
          { new: true }
        );
        res.redirect(`/b/${req.params.board}`);
      } catch (err) {
        return next(new Error("Error when posting reply"));
      }
    }) // Okey
    .put(async (req, res, next) => {
      const { thread_id, reply_id } = req.body;
      try {
        const updatedReply = await Reply.findByIdAndUpdate(
          reply_id,
          {
            reported: true
          },
          { new: true }
        );
        if (!updatedReply.reported) {
          return next(new Error("Cant update 'reported status' to `true`"));
        }
        // TODO: Update Thread replies

        const updatedThread = await Thread.findOneAndUpdate(
          {
            _id: mongoose.Types.ObjectId(thread_id),
            "replies._id": mongoose.Types.ObjectId(reply_id)
          },
          { $set: { "replies.$.reported": true } },
          { new: true }
        );
        console.log("TCL: updatedThread", updatedThread);

        res.send("success");
      } catch (err) {
        return next(new Error("Error during updating reply"));
      }
    }) // Okey
    .delete(async (req, res, next) => {
      const { thread_id, reply_id, delete_password } = req.body;
      if (!thread_id || !reply_id || !delete_password) {
        return next(new Error("Required fields is not filled"));
      }
      try {
        const reply = await Reply.findOne(mongoose.Types.ObjectId(reply_id));
        const isEqual = await bcrypt.compare(
          delete_password,
          reply.delete_password
        );
        if (!isEqual) {
          return next(new Error("passwords is not equal"));
        }

        const updatedReply = await Reply.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(reply_id) },
          { text: "[deleted]" }
        );
        console.log("TCL: updatedReply", updatedReply);

        await Thread.findOneAndUpdate(
          { _id: thread_id, "replies._id": mongoose.Types.ObjectId(reply_id) },
          { $set: { "replies.$.text": "[Deleted]" } },
          { new: true }
        );
        res.send("success");
      } catch (err) {
        return next(new Error("Error when setting reply [deleted]"));
      }
    }); // Okey
};
