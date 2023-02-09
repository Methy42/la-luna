import { app } from "electron";
import path from "path";
import Logger from "./logger";

class Constant {
  constructor() {
    if (process.env.NODE_ENV === "development") {
      this.resourcesPath = path.join(__dirname, "../../resources");
      this.mainWindowWebPath = "http://localhost:10234";
      this.updateWindowUIPath = path.join(__dirname, "../../update-ui/index.html");
      this.serverWindowUIPath = path.join(__dirname, "../../server-ui/index.html");
      this.windowsGetSerialNumberToolPath = path.join(__dirname, "../../resources/get_system_hdserial.exe");
    }
  }

  resourcesPath = "";
  platform = process.platform;
  logoImgName = "icon.png";
  mainWindowWebPath = "";
  updateWindowUIPath = "";
  serverWindowUIPath = "";
  windowsGetSerialNumberToolPath = "";

  currentVersionDescriptionFilePath = path.join(app.getPath("appData"), app.getName(), "current-version-description.txt");

  serverFilePath = path.join(app.getPath("appData"), app.getName(), "server.json");
}

export default new Constant();