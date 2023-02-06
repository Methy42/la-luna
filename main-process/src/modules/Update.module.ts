import { app, BrowserWindow, nativeImage } from "electron";
import path from "path";
import constant from "../utils/constant";

export function UpdateWindow() {
    const browserWindow = new BrowserWindow({
        width: 400,
        height: 300,
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
        browserWindow.webContents.loadFile(constant.updateWindowUIPath);
        browserWindow.webContents.openDevTools({ mode: 'detach' });
    } else { }

    browserWindow.show();

    return browserWindow;
}
