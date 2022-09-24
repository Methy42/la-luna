const { ipcMain }  = require("electron");
const mainWindow = require("./main-window");

const Events = function () {
  this.initialize = function (event) {
    ipcMain.on("select-music-score", () => {
      mainWindow.minimize();
    });
    
    ipcMain.on("open-project", () => {
      mainWindow.minimize();
    });
  }
}

module.exports = new Events();