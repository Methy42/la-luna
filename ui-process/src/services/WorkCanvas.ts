export default class WorkCanvas extends HTMLCanvasElement {
  constructor() {
    super();

    this.initSize();

    this.renderer();
  }

  context?: CanvasRenderingContext2D | null;

  ratio?: number;

  initSize() {
    const width = this.parentElement?.offsetWidth;
    const height = this.parentElement?.offsetHeight;
    width && (this.width = width);
    height && (this.height = height);
    
    this.ratio && (this.width = this.width * this.ratio);
    this.ratio && (this.height = this.height* this.ratio);
  }

  private renderer() {
    if (!this.context) {
      this.context = this.getContext("2d");

      if (this.context) {
        console.log("first!");
        const devicePixelRatio = window.devicePixelRatio || 1;
        const backingStoreRatio = (this.context as any)?.webkitBackingStorePixelRatio ||
          (this.context as any)?.mozBackingStorePixelRatio ||
          (this.context as any)?.value?.msBackingStorePixelRatio ||
          (this.context as any)?.value?.oBackingStorePixelRatio ||
          (this.context as any)?.value?.backingStorePixelRatio || 1;
        
        this.ratio = devicePixelRatio / backingStoreRatio;
        this.context?.scale(this.ratio, this.ratio);
        this.context?.translate(0.5, 0.5);
      }
    }

    this.dispatchEvent(new CustomEvent("renderer"));
    
    requestAnimationFrame(this.renderer.bind(this));
  }
}

// export default new WorkCanvas();