import path from "path";
import fs from "fs";
import { app, BrowserWindow, nativeImage, ipcMain } from "electron";
import constant from "../utils/constant";

export default function MainWindow () {
  const browserWindow = new BrowserWindow({
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

  if (constant.platform === 'darwin') {
    app.dock.setIcon(nativeImage.createFromPath(path.join(constant.resourcesPath, constant.logoImgName)));
  }

  if (process.env.NODE_ENV === 'development') {
    browserWindow.webContents.loadURL(constant.mainWindowWebPath);
    browserWindow.webContents.openDevTools({ mode: 'detach' });
  } else {}

  browserWindow.show();

  return browserWindow;
}
