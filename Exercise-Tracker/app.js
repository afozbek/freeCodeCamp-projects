const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/exercise-track");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  age: Number,
  username: {
    type: String,
    required: true
  }
});

const exerciseSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});

const User = mongoose.model("Users", userSchema);
const Exercise = mongoose.model("Exercises", exerciseSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  let username = req.body.username;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      const newUser = new User({
        username,
        name: "Abdullah Furkan Özbek",
        age: 24
      });
      const result = await newUser.save();
      res.json({
        username: result.username,
        _id: result._id
      });
    } else {
      res.json({
        message: "User already exist"
      });
    }
  } catch (err) {
    res.json({
      message: "Something was wrong ",
      err: err.message
    });
  }
});

app.post("/api/exercise/add", async (req, res) => {
  let userId = req.body.userId;
  try {
    let user = await User.findById(userId);
    if (!user) {
      res.json({
        message: "User is not exists"
      });
    } else {
      let { description, duration, date } = req.body;
      if (description === "" || duration === "") {
        res.json({
          message: "You must fill all required fields"
        });
      } else {
        let newDate = new Date(date);
        let newDate_ = isNaN(newDate.getMinutes()) ? new Date() : newDate;

        let exercise = {
          userId: user._id.toString(),
          description,
          duration,
          date: newDate_.toUTCString()
        };

        let newExercise = new Exercise(exercise);
        let result = await newExercise.save();
        console.log(result._doc);
        res.json({ ...result._doc, message: "We found it 😊" });
      }
    }
  } catch (err) {
    res.json({
      message: "Something was wrong",
      err: err.message
    });
  }
});

app.get("/api/exercise/log", async (req, res) => {
  let { userId, from, to, limit } = req.query;
  if (!userId) {
    res.json({
      message: "You must give us userId 😢"
    });
  } else {
    try {
      const user = await User.findById(userId);
      if (!user) {
        res.json({
          message: "We don't find the user 😢"
        });
      } else {
        let exercises = await Exercise.find({ userId });
        console.log(exercises);
        if (exercises) {
          res.json({
            _id: userId,
            message: "We found the exercises",
            count: exercises.length,
            log: [...exercises]
          });
        } else {
          res.json({
            message: "We can't find it"
          });
        }
      }
    } catch (err) {
      res.json({
        message: "Something was wrong ",
        err: err.message
      });
    }
  }
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
