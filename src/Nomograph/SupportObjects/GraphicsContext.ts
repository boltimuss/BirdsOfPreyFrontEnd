export class GraphicsContext
{

    private ctx: CanvasRenderingContext2D | null;
    private canvas: HTMLCanvasElement;
    private lineWidth;
    private ctxFont: string;

    constructor (ctx: CanvasRenderingContext2D)
    {
        this.ctx = ctx;
    }

    private getCtx(): CanvasRenderingContext2D
    {
        if (!this.ctx) throw new Error('Canvas 2D context not supported');
        else return this.ctx;
    }

    public save(): void
    {
        this.getCtx().save();
    }

    public restore(): void
    {
        this.getCtx().restore();
    }

    public fillOval(x: number, y: number, radiusX: number, radiusY: number): void
    {
        this.getCtx().beginPath();
        this.getCtx().ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        this.getCtx().fill();
    }

    public rotate(angle: number): void
    {
        let angleInRadians = angle * Math.PI / 180;
        this.getCtx().rotate(angleInRadians);
    }

    public clearRect(x: number, y: number, width: number, height: number)
    {
        this.getCtx().clearRect(x, y, width, height);
    }
    
    public setTransform(a: number, b: number, c: number, d: number, e: number, f: number)
    {
        this.getCtx().setTransform(a,b,c,d,e,f);
    }

    public translate(x: number, y: number)
    {
        this.getCtx().translate(x, y);
    }

    public scale(x: number, y: number)
    {
        this.getCtx().scale(x, y);
    }
    
    public setFill(color: string) 
    {
        this.getCtx().fillStyle = color;
    }

    public fillRect(x: number, y: number, width: number, height: number)
    {
        this.getCtx().fillRect(x, y, width, height);
    }

    public getLineWidth(): number{
        return this.lineWidth;
    }

    public setLineWidth(lineWidth: number): void{
        this.lineWidth = lineWidth;
    }

    public moveTo(x: number, y: number): void
    {
        this.getCtx().moveTo(x, y);
    }

    public lineTo(x: number, y: number): void{
        this.getCtx().lineTo(x, y);
    }

    public font(font: string): void{
        this.ctxFont = font;
    }

    public fillText(text: string, x: number, y: number): void
    {
        this.getCtx().font = this.ctxFont;
        this.getCtx().fillText(text, x, y);
    }

    public strokeLine(x1: number, y1: number, x2: number, y2: number): void
    {
        this.getCtx().beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.getCtx().stroke();
    }
}