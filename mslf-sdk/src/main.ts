import LineCellPlugin from "./LineCell.plugin";
import ParentFullSizePlugin from "./ParentFullSize.plugin";

export interface IPlugin {
    onCanvasLoad?: (ev: Event) => void;
    onCanvasMouseMove?: (ev: MouseEvent) => any;
    onCanvasClick?: (ev: MouseEvent) => any;
    renderer?: (ctx: CanvasRenderingContext2D) => void;
    [key: string]: any;
}

export default class MSLFCanvas {
    constructor(parentDOM: HTMLElement) {
        this.pluginList.forEach(plugin => {
            if (plugin.onCanvasLoad) this.canvas.addEventListener("load", plugin.onCanvasLoad.bind(plugin));
            if (plugin.onCanvasMouseMove) this.canvas.addEventListener("mousemove", plugin.onCanvasMouseMove.bind(plugin));
            if (plugin.onCanvasClick) this.canvas.addEventListener("click", plugin.onCanvasClick.bind(plugin));
        });

        parentDOM.appendChild(this.canvas);

        this.renderer();
    }

    canvas: HTMLCanvasElement = document.createElement("canvas");

    displayMultiplier: number = new Proxy<number>(2, {});

    pluginList: IPlugin[] = [ new LineCellPlugin({ displayMultiplier: this.displayMultiplier }), new ParentFullSizePlugin(this.canvas, { displayMultiplier: this.displayMultiplier }) ];

    renderer() {
        const ctx = this.canvas.getContext("2d");

        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.pluginList.forEach(plugin => {
            if (ctx) plugin.renderer?.(ctx);
        });

        requestAnimationFrame(this.renderer.bind(this));
    }
}