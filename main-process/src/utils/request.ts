import { createWriteStream, existsSync } from "fs";
import http from "http";
import path from "path";
import runtime from "../runtime";
import { DOWNLOAD_TARGET_PATH_NOTFIND } from "./errors";
import Logger from "./logger";

export interface IFetchOption {
    method: "POST" | "GET" | "PUT" | "DELETE"
}

export interface IResult<ResultType> {
    jsonData?: ResultType;
    response: http.IncomingMessage;
}

export interface IDownloadOption {
    sourcePath: string;
    targetPath: string;
    onProgress?: (receivedBytes: number, totalBytes: number) => void;
}

export function fetch<ResultType>(path: string, option: IFetchOption) {
    return new Promise<IResult<ResultType>>((resolve, reject) => {
        runtime.serverService.getServer().then(server => {
            const url = new URL(server.address + path);
            Logger.info("fetch:req", url);
            const request = http.request({
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: option.method,
            });

            request.on("response", (response) => {
                let resData = "";

                response.on("data", (chunk) => {
                    resData += chunk.toString("utf-8");
                });

                response.on("error", (error) => {
                    Logger.error(error);
                    reject(error);
                });

                response.on("end", () => {
                    Logger.info("fetch:res", resData);

                    let jsonData = undefined;

                    try {
                        jsonData = JSON.parse(resData);
                    } catch (error) {
                        Logger.error(error);
                    }

                    resolve({
                        jsonData,
                        response: response
                    });
                });
            });

            request.on("error", (error) => {
                Logger.error(error);
                reject(error);
            });

            request.end();
        }).catch(error => {
            Logger.error(error);
            reject(error);
        });
    })
}

export function download(option: IDownloadOption) {
    return new Promise<void>((resolve, reject) => {
        Logger.info("Download file", option);

        if (!existsSync(path.dirname(option.targetPath))) {
            Logger.error(DOWNLOAD_TARGET_PATH_NOTFIND, option.targetPath);
            return reject(new Error(DOWNLOAD_TARGET_PATH_NOTFIND));
        }

        const url = new URL(option.sourcePath);

        const request = http.request({
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: "GET",
        });

        request.on("response", (response) => {
            const targetFileSteam = createWriteStream(option.targetPath);
            response.pipe(targetFileSteam);

            if (option.onProgress) {
                const totalBytes = parseInt(response.headers['content-length'] || "0");
                let receivedBytes = 0;
                response.on("data", (chunk) => {
                    receivedBytes += chunk.length;
                    option.onProgress?.(receivedBytes, totalBytes);
                });
            }

            response.on("error", (error) => {
                reject(error);
            });

            response.on("end", () => {
                resolve();
            });
        });

        request.on("error", (error) => {
            reject(error);
        });

        request.end();
    })
}