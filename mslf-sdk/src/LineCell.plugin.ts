import { IPlugin, IRuntime } from "./main";

export type Point = [number, number];

export type Line = [Point, Point];

export type Cell = [Point, Point, Point, Point];

export default class LineCellPlugin implements IPlugin {
    constructor(canvas: HTMLCanvasElement, runtime: IRuntime) {
        this.displayMultiplier = runtime.displayMultiplier || 1;
        
        if (runtime.lineCell && runtime.lineCell.activeElements) {
            this.activeElements = runtime.lineCell.activeElements;
            this.initActiveElements();
        }
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

    activeElements?: { [ name: string ]: HTMLElement };

    setActive(active: "row" | "column" | "tag") {
        console.log(active);
        
        this.active = active;
    }

    initActiveElements() {
        if (this.activeElements) {
            console.log(this.activeElements);
            
            this.activeElements["row"].addEventListener("click", () => this.setActive("row"));
            this.activeElements["column"].addEventListener("click", () => this.setActive("column"));
            this.activeElements["tag"].addEventListener("click", () => this.setActive("tag"));
        }
    }

    getHoverLine(): Line | undefined {
        if (this.mouseX && this.mouseY && this.canvasWidth && this.canvasHeight) {
            if (this.active === "row" || this.active === "column") {
                let hoverLine: Line | undefined;
                hoverLine = this.rowLineArray.find(line => {
                    return this.mouseX && line[0][0] < this.mouseX && line[1][0] > this.mouseX && this.mouseY && Math.abs(line[0][1] - this.mouseY) < 5;
                });

                !hoverLine && (hoverLine = this.columnLineArray.find(line => {
                    return this.mouseY && line[0][1] < this.mouseY && line[1][1] > this.mouseY && this.mouseX && Math.abs(line[0][1] - this.mouseX) < 5;
                }));

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
                let leftLine: Line | undefined;
                let rightLine: Line | undefined;

                this.columnLineArray.forEach(line => {
                    if (this.mouseY && line[0][1] < this.mouseY && line[1][1] > this.mouseY) {
                        if (this.mouseX && line[0][0] < this.mouseX) {
                            if (!leftLine) {
                                leftLine = line;
                            } else if (line[0][0] > leftLine[0][0]) {
                                leftLine = line;
                            }
                        } else if (this.mouseX && line[0][0] > this.mouseX) {
                            if (!rightLine) {
                                rightLine = line;
                            } else if (line[0][0] < rightLine[0][0]) {
                                rightLine = line;
                            }
                        }
                    }
                });

                return [
                    [(leftLine?.[0][0] || 0), this.mouseY],
                    [(rightLine?.[0][0] || this.canvasWidth), this.mouseY]
                ];
            } else if (this.active === "column") {
                let topLine: Line | undefined;
                let bottomLine: Line | undefined;

                this.rowLineArray.forEach(line => {
                    if (this.mouseX && line[0][0] < this.mouseX && line[1][0] > this.mouseX){
                        if (this.mouseY && line[0][1] < this.mouseY) {
                            if (!topLine) {
                                topLine = line;
                            } else if (line[0][1] > topLine[0][1]) {
                                topLine = line;
                            }
                        } else if (this.mouseY && line[0][1] > this.mouseY) {
                            if (!bottomLine) {
                                bottomLine = line;
                            } else if (line[0][1] < bottomLine[0][1]) {
                                bottomLine = line;
                            }
                        }
                    }
                });

                return [
                    [this.mouseX, (topLine?.[0][1] || 0)],
                    [this.mouseX, (bottomLine?.[0][1] || this.canvasHeight)]
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

                console.log(this.rowLineArray, this.columnLineArray, hoverLine);
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

    drawLineHover(ctx: CanvasRenderingContext2D, line: Line) {
        ctx.beginPath();
        // 设置线宽
        ctx.lineWidth = 3;
        // 设置间距（参数为无限数组，虚线的样式会随数组循环）
        ctx.setLineDash([]);
        // 移动画笔至坐标 x20 y20 的位置
        ctx.moveTo(line[0][0] * this.displayMultiplier, line[0][1] * this.displayMultiplier);
        // 绘制到坐标 x20 y100 的位置
        ctx.lineTo(line[1][0] * this.displayMultiplier, line[1][1] * this.displayMultiplier);
        // 绘制到坐标 x70, y100 的位置
        // 填充颜色
        ctx.strokeStyle="blue";
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
        this.columnLineArray.forEach((line) => {
            this.drawLine(ctx, line);
        });
    }

    drawOnHover(ctx: CanvasRenderingContext2D) {
        const hoverLine = this.getHoverLine();
        
        if (hoverLine) {
            this.drawLineHover(ctx, hoverLine);
        }
    }

    renderer(ctx: CanvasRenderingContext2D) {
        this.canvasWidth = ctx.canvas.width;
        this.canvasHeight = ctx.canvas.height;

        this.drawOnHover(ctx);
        this.drawOnMouseMove(ctx);
        this.drawOnData(ctx);
    }
}