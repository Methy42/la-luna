import { BrowserWindow } from "electron";
import EventEmitter from "events";
import { getServer, IServer, ServerWindow, setServer } from "../modules/Server.module";
import { RENDER_SERVER, SET_SERVER } from "../utils/events";

export default class ServerService {
    private event: EventEmitter = new EventEmitter();

    public on: (event: typeof SET_SERVER, listener: (description: string) => void) => void = (event, listener) => {
        this.event.on(event, listener);
    } 

    public async setServer(server: IServer) {
        await setServer(server);

    };
    public getServer = getServer;

    public serverWindow?: BrowserWindow;

    public initWindow() {
        this.serverWindow = ServerWindow();

        this.serverWindow.on("close", () => {
            this.serverWindow = undefined;
        });
    }

    public showWindow() {
        if (this.serverWindow) {
            this.serverWindow.show();
            this.serverWindow.focus();
        } else this.initWindow();

        getServer().then((server) => {
            this.serverWindow?.webContents.send(RENDER_SERVER, server);
        });
    }
}