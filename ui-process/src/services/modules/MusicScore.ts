export interface IMusicScore {
  name: string;

  musicScoreBase64: string

  viewRegion: Array<{
    x: number;
    y: number;
  }>;

  rowLines: Array<{
    id: string;
    top: number;
  }>;

  sectionLines: Array<{
    id: string;
    topRowLineId: string;
    bottomRowLineId: string;
    left: number;
  }>;

  musicScoreMarks: Array<{
    id: string;
    label: string;
    topRowLineId: string;
    bottomRowLineId: string;
    leftSectionLineId: string;
    rightSectionLineId: string;
  }>;

  selectionRegionList: Array<Array<{
    x: number;
    y: number;
  }>>;
}

class MusicScore implements IMusicScore {
  name = "";
  musicScoreBase64 = "";
  viewRegion: Array<{
    x: number;
    y: number;
  }> = [];
  rowLines: Array<{
    id: string;
    top: number;
  }> = [];
  sectionLines: Array<{
    id: string;
    topRowLineId: string;
    bottomRowLineId: string;
    left: number;
  }> = [];
  musicScoreMarks: Array<{
    id: string;
    label: string;
    topRowLineId: string;
    bottomRowLineId: string;
    leftSectionLineId: string;
    rightSectionLineId: string;
  }> = [];
  selectionRegionList: Array<Array<{
    x: number;
    y: number;
  }>> = [];
}

export default new MusicScore();