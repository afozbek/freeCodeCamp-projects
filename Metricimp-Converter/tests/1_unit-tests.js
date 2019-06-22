var chai = require("chai");
var assert = chai.assert;
var ConvertHandler = require("../controllers/convertHandler.js");

var convertHandler = new ConvertHandler();

suite("Unit Tests", function() {
  suite("Function convertHandler.getNum(input)", function() {
    test("Whole number input", function(done) {
      var input = "32L";
      console.log(convertHandler.getNumAndUnit(input));
      assert.equal(convertHandler.getNumAndUnit(input)[0], "32");
      done();
    });

    test("Decimal Input", function(done) {
      let input = "32.5L";
      assert.equal(convertHandler.getNumAndUnit(input)[0], "32.5");
      done();
    });

    test("Fractional Input", function(done) {
      let input = "1/2L";
      assert.equal(convertHandler.getNumAndUnit(input)[0], "1/2");
      done();
    });

    test("Fractional Input w/ Decimal", function(done) {
      done();
    });

    test("Invalid Input (double fraction)", function(done) {
      done();
    });

    test("No Numerical Input", function(done) {
      let input = "km";
      assert.equal(convertHandler.getNumAndUnit(input), ["", "L"]);
      done();
    });
  });

  suite("Function convertHandler.getUnit(input)", function() {
    test("For Each Valid Unit Inputs", function(done) {
      var input = [
        "gal",
        "l",
        "mi",
        "km",
        "lbs",
        "kg",
        "GAL",
        "L",
        "MI",
        "KM",
        "LBS",
        "KG"
      ];
      input.forEach(function(ele) {
        let lowercase = ele.toLowerCase();
        assert.notEqual(convertHandler.getReturnUnit(lowercase), null);
      });
      done();
    });

    test("Unknown Unit Input", function(done) {
      let input = "ABC";
      assert.equal(convertHandler.getReturnUnit(input), null);
      done();
    });
  });

  suite("Function convertHandler.getReturnUnit(initUnit)", function() {
    test("For Each Valid Unit Inputs", function(done) {
      var input = ["gal", "l", "mi", "km", "lbs", "kg"];
      var expect = ["l", "gal", "km", "mi", "kg", "lbs"];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });
  });

  suite("Function convertHandler.spellOutUnit(unit)", function() {
    test("For Each Valid Unit Inputs", function(done) {
      //see above example for hint
      done();
    });
  });

  suite("Function convertHandler.convert(num, unit)", function() {
    test("Gal to L", function(done) {
      var input = [5, "gal"];
      var expected = 18.9271;
      assert.approximately(
        convertHandler.convert(input[0], input[1]),
        expected,
        0.1
      ); //0.1 tolerance
      done();
    });

    test("L to Gal", function(done) {
      //done();
      let input = ["5", "L"];
      let expected = 1.3208;
      assert.approximately(
        convertHandler.convert(input[0], input[1]),
        expected,
        0.1
      );
      done();
    });

    test("Mi to Km", function(done) {
      //done();
      let input = ["5", "mi"];
      let expected = 8.046;
      assert.approximately(
        convertHandler.convert(input[0], input[1]),
        expected,
        0.1
      );
      done();
    });

    test("Km to Mi", function(done) {
      //done();
      let input = ["5", "km"];
      let expected = 3.1069;
      assert.approximately(
        convertHandler.convert(input[0], input[1]),
        expected,
        0.1
      );
      done();
    });

    test("Lbs to Kg", function(done) {
      //done();
      let input = ["5", "lbs"];
      let expected = 2.26796;
      assert.approximately(
        convertHandler.convert(input[0], input[1]),
        expected,
        0.1
      );
      done();
    });

    test("Kg to Lbs", function(done) {
      //done();
      let input = ["5", "kg"];
      let expected = 11.02;
      assert.approximately(
        convertHandler.convert(input[0], input[1]),
        expected,
        0.1
      );
      done();
    });
  });
});
