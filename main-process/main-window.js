const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, nativeImage, ipcMain } = require("electron");
const constant = require("./constant");

const mainWindowList = [];

const MainWindow = function () {
  this.create = function (project) {
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      frame: false,
      transparent: true,
      show: false,
      icon: path.join(constant.resourcesPath, constant.logoImgName),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true,
        webSecurity: false
      }
    });

    mainWindowList.push(mainWindow);

    if (constant.platform === 'darwin') {
      app.dock.setIcon(nativeImage.createFromPath(path.join(constant.resourcesPath, constant.logoImgName)));
    }

    if (process.env.NODE_ENV === 'dev') {
      mainWindow.webContents.loadURL("http://localhost:10234");
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    } else {}

    mainWindow.show();

    if (project) {
      mainWindow.webContents.send("load-project", project);
    };
    
  }

  this.close = function ({ sender }) {
    if (sender) {
      const mainWindow = mainWindowList.find((mw) => mw.webContents.id === sender.id);
      mainWindow && mainWindow.close();
    }
  }

  this.maximize = function ({ sender }) {
    if (sender) {
      const mainWindow = mainWindowList.find((mw) => mw.webContents.id === sender.id);

      if (mainWindow) {
        if (constant.platform === "darwin") {
          mainWindow.setFullScreen(true);
        } else {
          mainWindow.maximize();
        }

        if (constant.platform === "darwin") {
          return true;
        } else {
          return mainWindow.isMaximized();
        }
      }
    }
    
  }

  this.unmaximize = function ({ sender }) {
    if (sender) {
      const mainWindow = mainWindowList.find((mw) => mw.webContents.id === sender.id);

      if (mainWindow) {
        if (constant.platform === "darwin") {
          mainWindow.setFullScreen(false);
        } else {
          mainWindow.unmaximize();
        }

        if (constant.platform === "darwin") {
          return false;
        } else {
          return mainWindow.isMaximized();
        }
      }
    }
  }

  this.minimize = function ({ sender }) {
    if (sender) {
      const mainWindow = mainWindowList.find((mw) => mw.webContents.id === sender.id);

      if (mainWindow) {
        mainWindow.minimize();
        return mainWindow.isMinimized();
      }
    }
  }

  this.isMaximized = function ({ sender }) {
    if (sender) {
      const mainWindow = mainWindowList.find((mw) => mw.webContents.id === sender.id);

      if (mainWindow) return mainWindow.isMaximized();
      else return false;
    }
  }

  this.send = function (event, option) {
    mainWindow.webContents.send(event, option);
  }

  this.initialize = function () {
    console.log("main window initialize start");

    ipcMain.on("main-window-close", (event) => {
      this.close(event);
    });
    
    ipcMain.on("main-window-maximize", (event) => {
      event.sender.send("main-window-is-maximize.cb", this.maximize(event));
    });
    
    ipcMain.on("main-window-unmaximize", (event) => {
      event.sender.send("main-window-is-maximize.cb", this.unmaximize(event));
    });
    
    ipcMain.on("main-window-minimize", (event) => {
      event.sender.send("main-window-minimize.cb", this.minimize(event));
    });

    ipcMain.on("main-window-is-maximize", (event) => {
      event.sender.send("main-window-is-maximize.cb", this.isMaximized(event));
    });

    ipcMain.on("drop-files", (event, { files }) => {
      console.log("drop files", files);
      
      files.forEach(file => {
        switch (file.type) {
          case "image/png":
            fs.readFile(file.path, (error, bitmap) => {
              const imageBase64 = Buffer.from(bitmap).toString('base64');
              event.sender.send("add-image", { imageBase64 });
            });
            break;
        
          default:
            break;
        }
      });
    });

    this.create();

  }
}

module.exports = new MainWindow();
