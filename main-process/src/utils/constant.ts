import path from "path";

class Constant {
  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.resourcesPath = path.join(__dirname, "../resources");
      this.mainWindowWebPath = "http://localhost:10234";
    }
  }

  resourcesPath = "";
  platform = process.platform;
  logoImgName = "icon.png";
  mainWindowWebPath = "";
}

export default new Constant();