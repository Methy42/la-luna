import { app } from "electron";
import runtime from "./runtime";

console.log("la-luna is running with", process.env.NODE_ENV);

app.whenReady().then(() => {
  console.log("la-luna app is ready");
  runtime.run();
});
