import Project, { type IProject } from "@/modules/Project";

export const ProjectEventMap = {
  PROJECT_CHANGE: "project-change"
}

export default class ProjectService extends EventTarget {
  static set(project: IProject) {
    Project.id = project.id;
    Project.name = project.name;
    Project.createTime = project.createTime;
    Project.updateTime = project.updateTime;
    Project.filePath = project.filePath;
    Project.musicScore = project.musicScore;
    Project.music = project.music;
    Project.author = project.author;

    this.prototype.dispatchEvent(new CustomEvent(ProjectEventMap.PROJECT_CHANGE, { detail: Project }))
  }

  static addImage(imageBase64: string) {
    Project.musicScore.musicScoreBase64 = imageBase64;
  }

  static addAudio(audioBase64: string) {
    Project.music.musicBase64 = audioBase64;
  }
}