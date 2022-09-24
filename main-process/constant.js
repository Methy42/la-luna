const path = require("path");

const Constant = function () {
  this.resourcesPath = "";
  this.platform = process.platform;
  this.logoImgName = "icon.png";

  this.initialize = function () {
    if (process.env.NODE_ENV === "dev") {
      this.resourcesPath = path.join(__dirname, "../resources");
      console.log("resources path is", this.resourcesPath);
    }
  }
}

module.exports = new Constant();