import { existsSync, readFile } from "fs";
import { getVersion } from "../utils/api";
import constant from "../utils/constant";

export interface IVersion {
    number: string;
    downloadPath: string;
    description: string;
}

export function getCurrentVersionDescription() {
    return new Promise<string>((resolve, reject) => {
        if (!existsSync(constant.currentVersionDescriptionFilePath)) {
            return resolve("");
        }

        readFile(constant.currentVersionDescriptionFilePath, (error, buffer) => {
            if (error) return reject(error);

            return resolve(buffer.toString("utf-8"));
        });
    })
}

export function getOnlineVersionList() {
    return getVersion();
}