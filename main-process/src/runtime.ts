import { BrowserWindow, ipcMain } from "electron";
import MainWindowService from "./services/MainWindow.service";
import { UNSUPPORTED_FILE_FORMAT } from "./utils/errors";
import { ADD_AUDIO, ADD_IMAGE, CALLBACK, DROP_FILES, HANDLE_ERROR, MAIN_WINDOW_CLOSE, MAIN_WINDOW_IS_MAXIMIZE, MAIN_WINDOW_MAXIMIZE, MAIN_WINDOW_MINIMZE, MAIN_WINDOW_UNMAXIMIZE } from "./utils/events";

class Runtime {
  mainWindowList: { [id: number]: BrowserWindow } = [];

  fileTypeToEventMap: { [key: string]: string } = {
    "image/png": ADD_IMAGE,
    "audio/mp3": ADD_AUDIO
  };

  run() {
    const mainWindow = MainWindowService.create();
    this.mainWindowList[mainWindow.webContents.id] = mainWindow;

    ipcMain.on(MAIN_WINDOW_CLOSE, (event) => MainWindowService.closeById(event.sender.id));

    ipcMain.on(MAIN_WINDOW_MAXIMIZE, (event) => event.sender.send(MAIN_WINDOW_MAXIMIZE + CALLBACK, MainWindowService.maximizeById(event.sender.id)));

    ipcMain.on(MAIN_WINDOW_UNMAXIMIZE, (event) => event.sender.send(MAIN_WINDOW_UNMAXIMIZE + CALLBACK, MainWindowService.unmaximizeById(event.sender.id)));

    ipcMain.on(MAIN_WINDOW_MINIMZE, (event) => event.sender.send(MAIN_WINDOW_MINIMZE + CALLBACK, MainWindowService.minimizeById(event.sender.id)));

    ipcMain.on(MAIN_WINDOW_IS_MAXIMIZE, (event) => event.sender.send(MAIN_WINDOW_IS_MAXIMIZE + CALLBACK, MainWindowService.getIsMaximizedById(event.sender.id)));

    ipcMain.on(DROP_FILES, (event, files: FileList) => {
      Array.from(files).forEach((file) => {
        if (["image/png", "audio/mp3"].includes(file.type)) {
          MainWindowService.dropFileByIdAsync(event.sender.id, file).then((fileBase64) => {
            event.sender.send(this.fileTypeToEventMap[file.type], fileBase64);
          }).catch((error: Error) => {
            event.sender.send(HANDLE_ERROR, error.message);
          });
        } else {
          event.sender.send(HANDLE_ERROR, UNSUPPORTED_FILE_FORMAT);
        }
      });
    });
  }
}

export default new Runtime();