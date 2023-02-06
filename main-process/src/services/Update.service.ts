import { BrowserWindow } from "electron";
import { UpdateWindow } from "../modules/Update.module";
import { getOnlineVersionList } from "../modules/Version.module";
import Logger from "../utils/logger";

export default class UpdateService {
    public updateWindow?: BrowserWindow;

    public initWindow() {
        this.updateWindow = UpdateWindow();

        this.updateWindow.on("close", () => {
            this.updateWindow = undefined;
        });
    }

    public checkUpdate() {
        getOnlineVersionList().then(versionList => {
            Logger.dev(versionList);
        });
    }

    public showWindow() {
        if (this.updateWindow) {
            this.updateWindow.show();
            this.updateWindow.focus();
        } else this.initWindow();
    }
}