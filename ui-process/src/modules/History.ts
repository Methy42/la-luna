import { ADD_HISTORY, BACK_HISTORY } from "../services/actionType";
import type { IProject } from "./Project";
import project from './Project';

export interface IHistory {
  historyStack: Array<{
    label: Symbol;
    projectState: string;
  }>;
  vernier: number;
}

class History implements IHistory {
  historyStack: Array<{
    label: Symbol;
    projectState: string;
  }> = [];
  vernier = 0;

  [ADD_HISTORY](label: Symbol, projectState: IProject) {
    this.historyStack.splice(this.vernier + 1);
    this.historyStack.push({
      label, projectState: JSON.stringify(projectState)
    });
    this.vernier = this.historyStack.length - 1;
  }

  // [BACK_HISTORY](newVernier: number) {
  //   if (this.historyStack[newVernier]) {
  //     project.set(JSON.parse(this.historyStack[newVernier].projectState));
  //   }
  // }
}

export default new History();