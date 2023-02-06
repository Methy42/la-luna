import { request } from "http";
import path from "path";
import runtime from "../runtime";
import { fetch } from "./request";

export async function getVersion() {
    return await fetch("/version", {
        method: "GET"
    });
}