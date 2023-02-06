import electron from "electron";
import EventEmitter from "events";
import { getCurrentVersionDescription, getOnlineVersionList } from "../modules/Version.module";
import { GET_CURRENT_VERSION_DESCRIPTION } from "../utils/events";

export default class VersionService {
    constructor() {
        getCurrentVersionDescription().then((description) => {
            this.currentVersionDescription = description;
            this.event.emit(GET_CURRENT_VERSION_DESCRIPTION, description);
        });
    }

    private event: EventEmitter = new EventEmitter();

    public currentVersionNumber: string = electron.app.getVersion();

    public currentVersionDescription?: string;

    public getCurrentVersionDescription = getCurrentVersionDescription;

    public getOnlineVersionList = getOnlineVersionList;

    public on: (event: typeof GET_CURRENT_VERSION_DESCRIPTION, listener: (description: string) => void) => void = (event, listener) => {
        this.event.on(event, listener);
    } 
}