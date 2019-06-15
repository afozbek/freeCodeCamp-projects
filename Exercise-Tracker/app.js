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

const User = mongoose.model("Users", userSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res) => {
  let username = req.body.username;
  try {
    let user = User.findOne({ username });
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
      message: "Something was wrong "
    });
  }
  res.json({
    message: "Post Works"
  });
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
