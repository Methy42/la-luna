import { IPlugin } from "./main";

export type Point = [number, number];

export type Line = [Point, Point];

export type Cell = [Point, Point, Point, Point];

export default class LineCellPlugin implements IPlugin {
    constructor(option?: {
        displayMultiplier?: number
    }) {
        if (option && option.displayMultiplier) this.displayMultiplier = option.displayMultiplier;
    }

    active?: "row" | "column" | "tag" = "row";

    canvasWidth?: number;

    canvasHeight?: number;

    mouseX?: number;

    mouseY?: number;

    rowLineArray: Array<Line> = [];

    columnLineArray: Array<Line> = [];

    tagCellArray: Array<Cell> = [];

    displayMultiplier: number = 1;

    getHoverLine(): Line | undefined {
        if (this.mouseX && this.mouseY && this.canvasWidth && this.canvasHeight) {
            if (this.active === "row" || this.active === "column") {
                let hoverLine: Line | undefined;
                hoverLine = this.rowLineArray.find(line => {
                    return this.mouseY && (line[0][1] - this.mouseY) > 5;
                });

                hoverLine = this.columnLineArray.find(line => {
                    return this.mouseY && (line[0][1] - this.mouseY) > 5;
                });

                return hoverLine;
            }
        }
        return undefined;
    };

    getHoverCell(): Cell | undefined {
        if (this.mouseX && this.mouseY && this.canvasWidth && this.canvasHeight) {
            let topLine: Line | undefined;
            let bottomLine: Line | undefined;
            let leftLine: Line | undefined;
            let rightLine: Line | undefined;

            this.rowLineArray.forEach(line => {
                if (line[0][1] >= (this.mouseY || 0)) {
                    topLine ? (topLine[0][1] > line[0][1]) && (topLine = line) : topLine = line;
                } else {
                    bottomLine ? (bottomLine[0][1] < line[0][1]) && (bottomLine = line) : bottomLine = line;
                }
            });

            this.columnLineArray.forEach(line => {
                if (line[0][1] >= (this.mouseX || 0)) {
                    leftLine ? (leftLine[0][1] > line[0][1]) && (leftLine = line) : leftLine = line;
                } else {
                    rightLine ? (rightLine[0][1] < line[0][1]) && (rightLine = line) : rightLine = line;
                }
            });

            if (topLine && bottomLine && leftLine && rightLine) {
                return [
                    [leftLine[0][0], topLine[0][1]],
                    [rightLine[0][0], topLine[0][1]],
                    [rightLine[0][0], bottomLine[0][1]],
                    [leftLine[0][0], bottomLine[0][1]]
                ];
            }
        }
        return undefined;
    };

    getLineByMouseMove(): Line | undefined {
        if (this.mouseX && this.mouseY && this.canvasWidth && this.canvasHeight) {
            if (this.active === "row") {
                return [
                    [0, this.mouseY],
                    [this.canvasWidth, this.mouseY]
                ];
            } else if (this.active === "column") {
                return [
                    [this.mouseX, 0],
                    [this.mouseX, this.canvasHeight]
                ];
            }
        }
        return undefined;
    };

    onCanvasMouseMove(event: MouseEvent) {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }

    onCanvasClick(event: MouseEvent) {
        if (this.active === "column" || this.active === "row") {
            const lineByMouseMove = this.getLineByMouseMove();
            const hoverLine = this.getHoverLine();
            if (lineByMouseMove) {
                if (hoverLine) {
                    this.active === "row" && this.rowLineArray.splice(this.rowLineArray.findIndex(line => line == hoverLine), 1);
                    this.active === "column" && this.columnLineArray.splice(this.columnLineArray.findIndex(line => line == hoverLine), 1);
                } else {
                    this.active === "row" && this.rowLineArray.push(lineByMouseMove);
                    this.active === "column" && this.columnLineArray.push(lineByMouseMove);
                }

                console.log(this.rowLineArray, hoverLine);
            }
        } else if (this.active === "tag") {
            const hoverCell = this.getHoverCell();
            if (hoverCell) {
                const existingIndex = this.tagCellArray.findIndex(cell => cell === hoverCell);

                if (existingIndex != -1) {
                    this.tagCellArray.splice(existingIndex, 1);
                } else {
                    this.tagCellArray.push(hoverCell);
                }
            }
        }
        
    }

    drawLine(ctx: CanvasRenderingContext2D, line: Line) {
        ctx.beginPath();
        // 设置线宽
        ctx.lineWidth = 1;
        // 设置间距（参数为无限数组，虚线的样式会随数组循环）
        ctx.setLineDash([8, 8]);
        // 移动画笔至坐标 x20 y20 的位置
        ctx.moveTo(line[0][0] * this.displayMultiplier, line[0][1] * this.displayMultiplier);
        // 绘制到坐标 x20 y100 的位置
        ctx.lineTo(line[1][0] * this.displayMultiplier, line[1][1] * this.displayMultiplier);
        // 绘制到坐标 x70, y100 的位置
        // 填充颜色
        ctx.strokeStyle="red";
        // 开始填充
        ctx.stroke();
        ctx.closePath();
    }

    drawOnMouseMove(ctx: CanvasRenderingContext2D) {
        const lineByMouseMove = this.getLineByMouseMove();

        if (lineByMouseMove && (this.active === "row" || this.active === "column")) {
            this.drawLine(ctx, lineByMouseMove);
        }
    }

    drawOnData(ctx: CanvasRenderingContext2D) {
        this.rowLineArray.forEach((line) => {
            this.drawLine(ctx, line);
        });
    }

    renderer(ctx: CanvasRenderingContext2D) {
        this.canvasWidth = ctx.canvas.width;
        this.canvasHeight = ctx.canvas.height;

        this.drawOnMouseMove(ctx);
        this.drawOnData(ctx);
    }
}