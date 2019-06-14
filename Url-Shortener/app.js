"use strict";

var express = require("express");
var mongoose = require("mongoose");

const isUrl = require("is-url");
var cors = require("cors");
const bodyParser = require("body-parser");
var app = express();

require("dotenv").config();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const UrlSchema = mongoose.model("Urls", { url: String });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl/new", (req, res) => {
  let url = req.body.url;
  if (isUrl(url)) {
    UrlSchema.create(
      {
        url: url
      },
      (err, data) => {
        console.log("Host", req.headers.host);
        if (!err) {
          res.json({
            original_url: url,
            short_url: data._id,
            origin: `http://${req.headers.host}/api/shorturl/${data._id}`
          });
        } else {
          res.json({
            message: "Something Wrong"
          });
        }
      }
    );
  } else {
    res.json({
      error: "invalid URL"
    });
  }
});

app.get("/api/shorturl/:urlId", (req, res) => {
  let urlId = req.params.urlId;
  UrlSchema.findById(urlId, (err, data) => {
    if (err) {
      res.json({
        message: "Can't find it"
      });
    } else {
      console.log(data.url);
      res.redirect(data.url);
    }
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(res => {
    app.listen(port, () => {
      console.log(`App listening on ${port}`);
    });
  })
  .catch(err => console.log(err));
