import LineCellPlugin from "./LineCell.plugin";
import ParentFullSizePlugin from "./ParentFullSize.plugin";

export interface IPluginConstructor {
    (canvas: HTMLCanvasElement, runtime: IRuntime): void
}

export interface IPlugin {
    new?: ((canvas: HTMLCanvasElement, runtime: IRuntime) => void) | IPluginConstructor;
    onCanvasLoad?: (ev: Event) => void;
    onCanvasMouseMove?: (ev: MouseEvent) => any;
    onCanvasClick?: (ev: MouseEvent) => any;
    renderer?: (ctx: CanvasRenderingContext2D) => void;
    [key: string]: any;
}

export interface IRuntime {
    displayMultiplier?: number;
    lineCell?: {
        activeElements?: { [ name: string ]: HTMLElement };
    };
}

export default class MSLFCanvas {
    constructor(parentDOM: HTMLElement, runtime?: IRuntime) {
        if (runtime) {
            console.log(runtime);
            
            Object.assign(this.runtime, runtime);
        }

        this.pluginList.push(new LineCellPlugin(this.canvas, this.runtime), new ParentFullSizePlugin(this.canvas, this.runtime));

        this.pluginList.forEach(plugin => {
            if (plugin.onCanvasLoad) this.canvas.addEventListener("load", plugin.onCanvasLoad.bind(plugin));
            if (plugin.onCanvasMouseMove) this.canvas.addEventListener("mousemove", plugin.onCanvasMouseMove.bind(plugin));
            if (plugin.onCanvasClick) this.canvas.addEventListener("click", plugin.onCanvasClick.bind(plugin));
        });

        parentDOM.appendChild(this.canvas);

        this.renderer();
    }

    canvas: HTMLCanvasElement = document.createElement("canvas");

    runtime: IRuntime = new Proxy<IRuntime>({
        displayMultiplier: 2
    }, {});

    pluginList: IPlugin[] = [];

    renderer() {
        const ctx = this.canvas.getContext("2d");

        ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.pluginList.forEach(plugin => {
            if (ctx) plugin.renderer?.(ctx);
        });

        requestAnimationFrame(this.renderer.bind(this));
    }
}