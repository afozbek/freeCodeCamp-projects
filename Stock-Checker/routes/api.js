"use strict";

var expect = require("chai").expect;

module.exports = function(app) {
  app.route("/api/stock-prices").get(async (req, res, next) => {});
};
