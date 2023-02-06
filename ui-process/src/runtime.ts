import { ref, type App, type Ref } from "vue";
import Project from "./modules/Project";
import ProjectService from "./services/Project";
import workCanvas from "./services/WorkCanvas";

class Runtime extends EventTarget {
  isMaximize: Ref<boolean> = ref(false);

  install(app: App) {
    window.require("electron").ipcRenderer.send("main-window-is-maximize");

    window.require("electron").ipcRenderer.on("main-window-is-maximize.cb", (event: any, result: boolean) => {
      console.log("main-window-is-maximize.cb", result);
      this.isMaximize.value = result;
      this.dispatchEvent(new CustomEvent("change:maximize", {
        detail: result
      }));
    });
    
    window.require("electron").ipcRenderer.on("add-image", (event: any, image: {
      name: string;
      base64: string
    }) => {
      ProjectService.addImage(image.base64);

      // app.config.globalProperties.$router.push({
      //   path: "/project"
      // });

      this.dispatchEvent(new CustomEvent("change:music-score", {
        detail: image
      }));
    });

    window.require("electron").ipcRenderer.on("add-audio", (event: any, audioBase64: string) => {
      ProjectService.addAudio(audioBase64);

      this.dispatchEvent(new CustomEvent("change:music", {
        detail: audioBase64
      }));
    });

    // onresize = () => {
    //   workCanvas.initSize();
    // }

    onmouseup = () => {
      this.dispatchEvent(new Event("mouseup"));
    }

    onmousemove = () => {
      this.dispatchEvent(new Event("mousemove"));
    }

    // workCanvas.addEventListener("renderer", (event) => {
    //   this.dispatchEvent(new CustomEvent("work-canvas:renderer", { detail: event.target }));
    // });
  }

  close() {
    window.require("electron").ipcRenderer.send("main-window-close");
  }

  maximize() {
    window.require("electron").ipcRenderer.send("main-window-maximize");
  }

  unmaximize() {
    window.require("electron").ipcRenderer.send("main-window-unmaximize");
  }

  minimize() {
    window.require("electron").ipcRenderer.send("main-window-minimize");
  }

  getMusicScoreImageBase64() {
    return Project.musicScore.musicScoreBase64;
  }

  // mountWorkCanvas(element: HTMLElement) {
  //   element.appendChild(workCanvas);
  //   workCanvas.initSize();
  // }
}

export default new Runtime();