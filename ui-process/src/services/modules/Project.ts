import { ADD_HISTORY, CREATE_PROJECT, DROP_FILES, LOAD_PROJECT } from "../actionType";
import { SAVE_PROJECT } from "../events";
import history from './History';
import type { IMusic } from "./Music";
import type { IMusicScore } from "./MusicScore";
import musicScore from './MusicScore';
import music from './Music';
import { useRouter } from "vue-router";

export interface IProject {
  id: string;
  name: string;
  createTime: number;
  updateTime: number;
  filePath: string;
  musicScore: IMusicScore;
  music: IMusic;
  author: string;
}

export interface ICreateProject {
  type: "file";
  option: unknown;
}

class Project implements IProject {
  id = "";
  name = "";
  createTime = new Date().getTime();
  updateTime = new Date().getTime();
  filePath = "";
  musicScore = musicScore;
  music = music;
  author = "";

  saveTime = NaN;

  install(app: any) {
    window.require("electron").ipcRenderer.on("add-image", (event: any, { imageBase64 }: any) => {
      console.log("add image", imageBase64);
      this.musicScore.musicScoreBase64 = imageBase64;
      app.config.globalProperties.$router.push({
        path: "/project"
      });
    });
  }

  get() {
    return {
      id: this.id,
      name: this.name,
      createTime: this.createTime,
      updateTime: this.updateTime,
      filePath: this.filePath,
      musicScore: this.musicScore,
      music: this.music,
      author: this.author,
    };
  }

  set(project: IProject) {
    this.id = project.id;
    this.name = project.name;
    this.createTime = project.createTime;
    this.updateTime = project.updateTime;
    this.filePath = project.filePath;
    this.musicScore = project.musicScore;
    this.music = project.music;
    this.author = project.author;
  }

  save() {
    window.require("electron").ipcRenderer.send(SAVE_PROJECT, this.get());
  }

  [LOAD_PROJECT](project: IProject) {
    this.set(project);
    this.saveTime = project.updateTime;
    
    history[ADD_HISTORY](LOAD_PROJECT, this.get());
  };

  [DROP_FILES](files: FileList) {
    window.require("electron").ipcRenderer.send("drop-files", {
      files: Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        path: (file as any).path
      }))
    });
  }
}

export default new Project();