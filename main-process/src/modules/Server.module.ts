import { app, BrowserWindow, nativeImage } from "electron";
import { existsSync, readFile, writeFile } from "fs";
import path from "path";
import constant from "../utils/constant";

export interface IServer {
    address: string;
}

export function setServer(server: IServer) {
    return new Promise<void>((resolve, reject) => {
        writeFile(constant.serverFilePath, JSON.stringify(server), {
            encoding: "utf-8"
        }, (error) => {
            if (error) return reject(error);

            return resolve();
        })
    })
}

export function getServer() {
    return new Promise<IServer>((resolve, reject) => {
        if (!existsSync(constant.serverFilePath)) {
            return resolve({ address: "" });
        }

        readFile(constant.serverFilePath, (error, buffer) => {
            if (error) return reject(error);

            return resolve(JSON.parse(buffer.toString("utf-8")));
        });
    })
}

export function ServerWindow() {
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
        browserWindow.webContents.loadFile(constant.serverWindowUIPath);
        browserWindow.webContents.openDevTools({ mode: 'detach' });
    } else { }

    browserWindow.show();

    return browserWindow;
}