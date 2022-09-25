export interface IMusic {
  name: string;

  musicBase64: string;

  musicMarks: Array<{
    id: string;
    label: string;
    time: number;
  }>;
}

class Music implements IMusic {
  name = "";
  musicBase64 = "";
  musicMarks: Array<{
    id: string;
    label: string;
    time: number;
  }> = [];
}

export default new Music();