"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var expect = require("chai").expect;
var cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

app.use("/public", express.static(process.cwd() + "/public"));

//Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "maxcdn.bootstrapcdn.com"]
      }
    },
    referrerPolicy: {
      policy: "same origin"
    },
    dnsPrefetchControl: {
      allow: true
    }
  })
);

require("dotenv").config();

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route("/b/:board/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/board.html");
});
app.route("/b/:board/:threadid").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/thread.html");
});

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

//500 Error Middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    location: "Error Middleware"
  });
});

const CONNECTION_STRING = process.env.DB;

mongoose
  .connect(CONNECTION_STRING, { useNewUrlParser: true, useCreateIndex: true })
  .then(res => {
    console.log("Db connection successfull");
    //Start our server and tests!
    app.listen(process.env.PORT || 4000, function() {
      console.log("Listening on port " + process.env.PORT);
      if (process.env.NODE_ENV === "test") {
        console.log("Running Tests...");
        setTimeout(function() {
          try {
            runner.run();
          } catch (e) {
            var error = e;
            console.log("Tests are not valid:");
            console.log(error);
          }
        }, 3500);
      }
    });
  })
  .catch(err => {
    console.log(err);
  });

module.exports = app; //for testing
