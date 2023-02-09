import LineCellPlugin from "./LineCell.plugin";

export interface IPlugin {
    onCanvasMouseMove?: (ev: MouseEvent) => any;
    onCanvasClick?: (ev: MouseEvent) => any;
    renderer?: (ctx: CanvasRenderingContext2D) => void;
}

export default class MSLFCanvas extends HTMLCanvasElement {
    constructor() {
        super();

        this.pluginList.forEach(plugin => {
            if (plugin.onCanvasMouseMove) this.addEventListener("mousemove", plugin.onCanvasMouseMove.bind(plugin));
            if (plugin.onCanvasClick) this.addEventListener("click", plugin.onCanvasClick.bind(plugin));
        });
    }

    displayMultiplier: number = 1;

    pluginList: IPlugin[] = [ new LineCellPlugin() ];

    renderer() {
        const ctx = this.getContext("2d");

        this.pluginList.forEach(plugin => {
            if (ctx) plugin.renderer?.(ctx);
        });
    }
}

