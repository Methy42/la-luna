import { ADD_HISTORY, CREATE_PROJECT, DROP_FILES, LOAD_PROJECT } from "../services/actionType";
import { SAVE_PROJECT } from "../services/events";
import history from './History';
import type { IMusic } from "./Music";
import type { IMusicScore } from "./MusicScore";
import musicScore from './MusicScore';
import music from './Music';
import { createStore } from 'store';

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

  [DROP_FILES](files: FileList) {
    window.require("electron").ipcRenderer.send("drop-files", Array.from(files).map(file => ({
      name: file.name,
      type: file.type,
      path: (file as any).path
    })));
  }
}

export default new Project();