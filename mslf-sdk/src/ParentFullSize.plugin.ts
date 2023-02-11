import { IPlugin } from "./main";

interface IParentFullSizePlugin {
    displayMultiplier?: number;
    initCanvasSize: () => void;
}

export default class ParentFullSizePlugin implements IPlugin, IParentFullSizePlugin {
    constructor(canvas: HTMLCanvasElement, option?: {
        displayMultiplier?: number;
    }) {
        this.canvas = canvas;
        this.canvas.style.display = "block";

        if (option && option.displayMultiplier) this.displayMultiplier = option.displayMultiplier;

        setTimeout(() => {
            this.initCanvasSize();
        });

        window.addEventListener("resize", () => {
            this.initCanvasSize();
        });
    }

    canvas: HTMLCanvasElement;

    displayMultiplier?: number = 1;

    initCanvasSize: () => void = () => {
        const option = {
            width: this.canvas.parentElement?.offsetWidth,
            height: this.canvas.parentElement?.offsetHeight
        }

        console.log(Math.max(this.canvas.parentElement?.offsetHeight || 0), this.canvas.parentElement?.clientHeight, document.getElementById("melf-canvas")?.offsetHeight, option);
        
        this.canvas.style.width = option.width + "px";
        this.canvas.style.height = option.height + "px";

        option.width && (this.canvas.width = option.width * (this.displayMultiplier || 1));
        option.height && (this.canvas.height = option.height * (this.displayMultiplier || 1));
    };
}