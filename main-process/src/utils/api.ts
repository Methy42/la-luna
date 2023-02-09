import { request } from "http";
import path from "path";
import runtime from "../runtime";
import { fetch } from "./request";

export interface IHalResult {
    _embedded: any;
    _links: any;
}

export async function getVersion() {
    return await fetch<IHalResult>("/version", {
        method: "GET"
    });
}