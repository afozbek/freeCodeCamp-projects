function ConvertHandler() {
  this.getNumAndUnit = function(input) {
    let isChar = /[a-z]/i;
    let initNum = "";
    let initUnit = "";

    for (let char of input) {
      if (isChar.test(char)) {
        initUnit += char;
      } else {
        initNum += char;
      }
    }

    return [initNum, initUnit];
  };

  this.getReturnUnit = function(initUnit) {
    let lowerInitUnit = initUnit.toLowerCase();
    switch (lowerInitUnit) {
      case "gal":
        return "L";
      case "l":
        return "gal";
      case "lbs":
        return "kg";
      case "kg":
        return "lbs";
      case "mi":
        return "km";
      case "km":
        return "mi";
      default:
        return null;
    }
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541; // 1 gal
    const lbsToKg = 0.453592; // 1 lbs
    const miToKm = 1.60934; // 1 mi

    let lowerInitUnit = initUnit.toLowerCase();
    let initNum_ = eval(initNum);
    switch (lowerInitUnit) {
      case "gal":
        return initNum_ * galToL;
      case "l":
        return initNum_ / galToL;
      case "lbs":
        return initNum_ * lbsToKg;
      case "kg":
        return initNum_ / lbsToKg;
      case "mi":
        return initNum_ * miToKm;
      case "km":
        return initNum_ / miToKm;
      default:
        return null;
    }
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    var result;
    result = `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`;
    return result;
  };
}

module.exports = ConvertHandler;
