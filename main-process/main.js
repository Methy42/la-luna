const { app } = require("electron");
const mainWindow = require("./main-window");
const constant = require("./constant");
const evnets = require("./events");

console.log("la-luna is running with", process.env.NODE_ENV);

app.whenReady().then(() => {
  console.log("la-luna app is ready");
  constant.initialize();
  evnets.initialize();
  mainWindow.initialize();
});
