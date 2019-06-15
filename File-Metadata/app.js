"use strict";

var express = require("express");
var cors = require("cors");

const multer = require("multer");
// require and use "multer"...
const upload = multer({ dest: __dirname + "/files" });

var app = express();

require("dotenv").config();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  let { buffer, encoding, size, originalname, mimetype } = req.file;
  res.json({
    message: "File handling",
    buffer,
    encoding,
    size,
    originalname,
    mimetype
  });
});

app.get("/hello", function(req, res) {
  res.json({ greetings: "Hello, API" });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Node.js listening ...");
});
