"use strict";

var expect = require("chai").expect;
var ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function(app) {
  var convertHandler = new ConvertHandler();

  app.route("/api/convert").get(function(req, res) {
    var input = req.query.input;
    var [initNum, initUnit] = convertHandler.getNumAndUnit(input);
    var returnNum = convertHandler.convert(initNum, initUnit);
    var returnUnit = convertHandler.getReturnUnit(initUnit);

    if (!returnNum || !returnUnit) {
      return res.status(500).json({
        message: "Error when converting"
      });
    }

    var toString = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );
    return res.json({
      initNum,
      initUnit,
      returnNum: returnNum.toString(),
      returnUnit,
      string: toString
    });
  });
};
