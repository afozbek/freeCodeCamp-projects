// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(req.method + " - " + req.path);
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/timestamp/:date_string?", (req, res, next) => {
  // TODO
  console.log(req.params.date_string);
  let dateString = req.params.data_string;
  let newTime = new Date();
  if (!dateString) {
    res.json({
      unix: newTime.getTime(),
      utc: newTime.toUTCString()
    });
  }
  res.json({ unix: new Date(), utc: new Date().toUTCString() });
});

// your first API endpoint...
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

const PORT = 3000 || process.env.PORT;
// listen for requests :)
app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}`);
});
