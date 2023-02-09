import { IPlugin } from "./main";

export type Point = [number, number];

export type Line = [Point, Point];

export type Cell = [Point, Point, Point, Point];

export default class LineCellPlugin implements IPlugin {
    active?: "row" | "column" | "tag";

    mouseX?: number;

    mouseY?: number;

    lineByMouseMove?: Line;

    cellByMouseMove?: Cell;

    lineSet: Set<Line> = new Set();

    cellSet: Set<Cell> = new Set();

    hoverLine(line: Line) {
    }

    hoverCell(cell: Cell) {
    }

    checkExistingLine: (line: Line) => Line | undefined = (line: Line) => {
        switch (this.active) {
            case "row":
            case "column":
                return undefined;
                break;
            case "tag":
                break;
            default:
                break;
        }
    }

    onCanvasMouseMove(event: MouseEvent) {
        switch (this.active) {
            case "row":
                
                break;
            case "column":
                break;
            case "tag":
                break;
            default:
                break;
        }
    }

    onCanvasClick(event: MouseEvent) {
        // switch (this.active) {
        //     case "row":
        //         if (this.rowLineByMouseMove) {
        //             const existingLine = this.checkExistingLine(this.rowLineByMouseMove);
        //             if (existingLine) {
        //                 this.rowLineList.delete(existingLine);
        //             } else {
        //                 this.rowLineList.add(this.rowLineByMouseMove);
        //             }
        //         }
        //         break;
        //     case "column":
        //         if (this.columnLineByMouseMove) this.columnLineList.add(this.columnLineByMouseMove);
        //         break;
        //     case "tag":
        //         if (this.tagCellByMouseMove) this.tagCellList.add(this.tagCellByMouseMove);
        //         break;
        //     default:
        //         break;
        // }
    }

    renderer(ctx: CanvasRenderingContext2D) {}
}