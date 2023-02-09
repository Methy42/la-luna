import { app, BrowserWindow, dialog, ipcMain, IpcMainEvent } from "electron";
import { rename } from "fs";
import path from "path";
import { UpdateWindow } from "../modules/Update.module";
import { getOnlineVersionList, IVersion } from "../modules/Version.module";
import { UPDATE_DOWNLOAD, UPDATE_DOWNLOAD_FAILED, UPDATE_DOWNLOAD_PROCESS, UPDATE_DOWNLOAD_SUCCESS, UPDATE_INSTALL, UPDATE_INSTALL_FAILED, UPDATE_INSTALL_SUCCESS, UPDATE_RESTART_APP, UPDATE_VERSION_UI_INIT } from "../utils/events";
import Logger from "../utils/logger";
import { download } from "../utils/request";

export default class UpdateService {
    constructor() {
        ipcMain.on(UPDATE_DOWNLOAD, this.updateDownload.bind(this));
        ipcMain.on(UPDATE_INSTALL, this.updateInstall.bind(this));
        ipcMain.on(UPDATE_RESTART_APP, this.updateRestart.bind(this));
    }

    public updateWindow?: BrowserWindow;
    public lastVersion?: IVersion;

    public initWindow() {
        this.updateWindow = UpdateWindow();

        this.updateWindow.on("close", () => {
            this.updateWindow = undefined;
        });
    }

    public checkUpdate() {
        getOnlineVersionList().then(result => {
            const versionList = result.jsonData?._embedded.versions;

            this.lastVersion = versionList[0];

            if (this.lastVersion) {
                this.showWindow();
                this.updateWindow?.webContents.send(UPDATE_VERSION_UI_INIT, this.lastVersion);
            }
        });
    }

    public updateDownload(event: IpcMainEvent, version: IVersion) {
        let lastProgressTime = new Date().getTime();
        let lastReceivedBytes = 0;

        download({
            sourcePath: version.downloadPath,
            targetPath: path.join(app.getPath("downloads"), path.basename(version.downloadPath)),
            onProgress(receivedBytes, totalBytes) {
                const nowTime = new Date().getTime();
                const speed = (receivedBytes - lastReceivedBytes) / (nowTime - lastProgressTime);
                event.sender.send(UPDATE_DOWNLOAD_PROCESS, {
                    progress: receivedBytes / totalBytes,
                    speed
                });
            },
        }).then(() => {
            event.sender.send(UPDATE_DOWNLOAD_SUCCESS);
        }).catch((error) => {
            event.sender.send(UPDATE_DOWNLOAD_FAILED, error);
        });
    }

    public updateInstall(event: IpcMainEvent, version: IVersion) {
        const updateFilePath = path.join(app.getPath("downloads"), path.basename(version.downloadPath));

        const appPath = path.join(path.dirname(app.getPath("exe")), "resources", "app.asar");

        const appBakPath = path.join(path.dirname(app.getPath("exe")), "resources", "app.asar.bak");
        
        rename(appPath, appBakPath, (error) => {
            if (error) return event.sender.send(UPDATE_INSTALL_FAILED, error);

            rename(updateFilePath, appPath, (error) => {
                if (error) {
                    rename(appBakPath, appPath, (error) => {
                        if (error) dialog.showErrorBox("The client is corrupted", "The client update installation failed. The client program is damaged. Please uninstall and remove the client before reinstalling");
                    });
                    return event.sender.send(UPDATE_INSTALL_FAILED, error);
                }

                event.sender.send(UPDATE_INSTALL_SUCCESS);
            });
        });
    }

    public updateRestart() {
        app.relaunch();
        app.quit();
    }

    public showWindow() {
        if (this.updateWindow) {
            this.updateWindow.show();
            this.updateWindow.focus();
        } else this.initWindow();
    }
}