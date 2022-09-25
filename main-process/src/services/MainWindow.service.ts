import fs from "fs";
import MainWindow from "../modules/MainWindow.module";
import runtime from "../runtime";
import constant from "../utils/constant";
import { UNSUPPORTED_FILE_FORMAT, WINDOW_NOT_FOUND } from "../utils/errors";

export default class MainWindowServices {
  static create() {
    return MainWindow();
  }

  static closeById (id: number) {
    if (runtime.mainWindowList[id]) {
      runtime.mainWindowList[id].once("closed", () => delete runtime.mainWindowList[id]);
      runtime.mainWindowList[id].close();
    }
  }

  static maximizeById (id: number) {
    if (runtime.mainWindowList[id]) {
      if (constant.platform === "darwin") {
        runtime.mainWindowList[id].setFullScreen(true);
      } else {
        runtime.mainWindowList[id].maximize();
      }

      if (constant.platform === "darwin") {
        return true;
      } else {
        return runtime.mainWindowList[id].isMaximized();
      }
    }
    
  }

  static unmaximizeById (id: number) {
    if (runtime.mainWindowList[id]) {
      if (constant.platform === "darwin") {
        runtime.mainWindowList[id].setFullScreen(false);
      } else {
        runtime.mainWindowList[id].unmaximize();
      }

      if (constant.platform === "darwin") {
        return false;
      } else {
        return runtime.mainWindowList[id].isMaximized();
      }
    }
  }

  static minimizeById (id: number) {
    if (runtime.mainWindowList[id]) {
      runtime.mainWindowList[id].minimize();
      return runtime.mainWindowList[id].isMinimized();
    }
  }

  static getIsMaximizedById (id: number) {
    if (runtime.mainWindowList[id]) return runtime.mainWindowList[id].isMaximized();
    else return false;
  }

  static async dropFileByIdAsync (id: number, file: File) {
    if (runtime.mainWindowList[id]) {
      return new Promise<string>((resolve, reject) => {
        fs.readFile(file.path, (error, bitmap) => {
          if (error) return reject(error);
          const imageBase64 = Buffer.from(bitmap).toString('base64');
          return resolve(imageBase64);
        });
      });
    } else {
      return Promise.reject(new Error(WINDOW_NOT_FOUND));
    }
  }
}