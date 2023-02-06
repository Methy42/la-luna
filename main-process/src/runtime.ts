import { BrowserWindow, ipcMain } from "electron";
import { IServer } from "./modules/Server.module";
import MainWindowService from "./services/MainWindow.service";
import ServerService from "./services/Server.service";
import UpdateService from "./services/Update.service";
import VersionService from "./services/Version.service";
import { UNSUPPORTED_FILE_FORMAT } from "./utils/errors";
import { ADD_AUDIO, ADD_IMAGE, CALLBACK, DROP_FILES, GET_ONLINE_VERSION_LIST, HANDLE_ERROR, MAIN_WINDOW_CLOSE, MAIN_WINDOW_IS_MAXIMIZE, MAIN_WINDOW_MAXIMIZE, MAIN_WINDOW_MINIMZE, MAIN_WINDOW_UNMAXIMIZE, SET_SERVER, SHOW_SERVER_WINDOW } from "./utils/events";
import Logger from "./utils/logger";

class Runtime {
  mainWindowList: { [id: number]: BrowserWindow } = [];

  serverService: ServerService = new ServerService();

  updateService: UpdateService = new UpdateService();

  versionService: VersionService = new VersionService();

  fileTypeToEventMap: { [key: string]: string } = {
    "image/png": ADD_IMAGE,
    "audio/mpeg": ADD_AUDIO
  };

  async run() {
    this.initIPC();

    const server = await this.serverService.getServer();

    Logger.dev(server);

    if (server.address) {
      this.updateService.checkUpdate()
      // this.updateService.showWindow();
    }

    const mainWindow = MainWindowService.create();
    this.mainWindowList[mainWindow.webContents.id] = mainWindow;
  }

  initIPC() {
    ipcMain.on(MAIN_WINDOW_CLOSE, (event) => MainWindowService.closeById(event.sender.id));

    ipcMain.on(MAIN_WINDOW_MAXIMIZE, (event) => {
      const result = MainWindowService.maximizeById(event.sender.id);
      event.sender.send(MAIN_WINDOW_MAXIMIZE + CALLBACK, result);
      event.sender.send(MAIN_WINDOW_IS_MAXIMIZE + CALLBACK, result);
    });

    ipcMain.on(MAIN_WINDOW_UNMAXIMIZE, (event) => {
      const result = MainWindowService.unmaximizeById(event.sender.id);
      event.sender.send(MAIN_WINDOW_UNMAXIMIZE + CALLBACK, result);
      event.sender.send(MAIN_WINDOW_IS_MAXIMIZE + CALLBACK, result);
    });

    ipcMain.on(MAIN_WINDOW_MINIMZE, (event) => event.sender.send(MAIN_WINDOW_MINIMZE + CALLBACK, MainWindowService.minimizeById(event.sender.id)));

    ipcMain.on(MAIN_WINDOW_IS_MAXIMIZE, (event) => event.sender.send(MAIN_WINDOW_IS_MAXIMIZE + CALLBACK, MainWindowService.getIsMaximizedById(event.sender.id)));

    ipcMain.on(DROP_FILES, (event, files: FileList) => {
      Array.from(files).forEach((file) => {
        if (Object.keys(this.fileTypeToEventMap).includes(file.type)) {
          MainWindowService.dropFileByIdAsync(event.sender.id, file).then((fileBase64) => {
            event.sender.send(this.fileTypeToEventMap[file.type], { name: file.name, base64: fileBase64 });
          }).catch((error: Error) => {
            event.sender.send(HANDLE_ERROR, error.message);
          });
        } else {
          event.sender.send(HANDLE_ERROR, UNSUPPORTED_FILE_FORMAT);
        }
      });
    });

    ipcMain.on(GET_ONLINE_VERSION_LIST, (event) => {
      this.versionService.getOnlineVersionList().then((result) => {
        event.sender.send(GET_ONLINE_VERSION_LIST + CALLBACK, result);
      }).catch(reason => {
        event.sender.send(HANDLE_ERROR, reason);
      });
    });

    ipcMain.on(SHOW_SERVER_WINDOW, () => {
      this.serverService.showWindow();
    });

    ipcMain.on(SET_SERVER, (event, option: IServer) => {
      this.serverService.setServer(option);
    });
  }
}

export default new Runtime();