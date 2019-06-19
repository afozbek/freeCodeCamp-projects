"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var expect = require("chai").expect;
var cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

require("dotenv").config();

app.use(
  helmet({
    xssFilter: {
      reportUri: "/report-xss-violation"
    },
    frameguard: {
      action: "deny"
    },
    hidePoweredBy: {
      setTo: "PHP 4.2.0"
    }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route("/:project/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/issue.html");
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

const port = process.env.PORT || 4000;
//Start our server and tests!
const CONNECTION_STRING = process.env.MONGO_URI; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose
  .connect(CONNECTION_STRING, { useNewUrlParser: true })
  .then(res => {
    console.log("Database connection successfull");
    app.listen(port, function() {
      console.log("Listening on port " + port);
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
  .catch(err => console.log(err));

module.exports = app; //for testing
