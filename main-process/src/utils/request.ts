import http from "http";
import runtime from "../runtime";
import Logger from "./logger";

export interface IFetchOption {
    method: "POST" | "GET" | "PUT" | "DELETE"
}

export interface IResult<ResultType> {
    jsonData?: ResultType;
    response: http.IncomingMessage;
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
                method: option.method
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
        }).catch(error => {
            Logger.error(error);
            reject(error);
        });
    })
}