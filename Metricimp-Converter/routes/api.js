"use strict";

var expect = require("chai").expect;
var ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function(app) {
  var convertHandler = new ConvertHandler();

  app.route("/api/convert").get(function(req, res) {
    var input = req.query.input;
    var [initNum, initUnit] = convertHandler.getNumAndUnit(input);
    var returnNum = convertHandler.convert(initNum, initUnit).toString();
    var returnUnit = convertHandler.getReturnUnit(initUnit);
    if (!returnNum || !returnUnit) {
      return res.json({
        message: "Error when converting"
      });
    }

    var toString = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );
    res.json({
      initNum,
      initUnit,
      returnNum,
      returnUnit,
      string: toString
    });
  });
};
