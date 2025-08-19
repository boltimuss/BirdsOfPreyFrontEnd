import { Rectangle2D } from "./SupportObjects/Rectangle2D";
import { Point2D } from './SupportObjects/Point2D';
import { GraphicsContext } from "./SupportObjects/GraphicsContext";
import { AbstractScale } from "./Scale/AbstractScale" 
import { GameState } from "../State/GameState";

export abstract class Chart
{
    wasDragged: boolean;
	mmPerPixel: number;
	scales = new Map<string, AbstractScale>(); 
	width: number;
	height: number;
	ctx: GraphicsContext;
	scaleMargin: number = 12;
	gameState:  { aircraftStates: Map<string, any>, currentAircraftId: string};
	
	constructor(dimensions: Rectangle2D, canvas: any)
	{
		this.width = dimensions.getWidth();
		this.height = dimensions.getHeight();
		this.ctx = new GraphicsContext(canvas);
		this.mmPerPixel = (window.devicePixelRatio * 96)/25.4;
		this.ctx.clearRect(-10, 0, this.width, this.height);
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.translate(this.scaleMargin * this.mmPerPixel, 0);
		this.init(this.ctx);
		this.gameState = { "aircraftStates": new Map<string, any>(), currentAircraftId: ""};
		this.draw(1.0);

	}

	calculateIntersectionPoint(m1: number,  b1: number, m2: number, b2: number): Point2D | null
	{

	    if (m1 == m2) {
	        return null;
	    }

	    let x = (b2 - b1) / (m1 - m2);
	    let y = (m1 * x) + b1;

	    return new Point2D(x, y);
	}
	
	draw(scale: number)
	{
		// scale = .84;
		this.ctx.clearRect(-this.scaleMargin*this.mmPerPixel, 0, this.width, this.height);
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.translate(this.scaleMargin * this.mmPerPixel, 0);
		this.ctx.scale(scale, scale);
		for (let s of this.scales.values()) s.draw(this.ctx);
		for (let s of this.scales.values()) s.drawDraggableNotch(this.ctx);
		
		// this.ctx.setFill("rgb(255,0,0,0.5)");
		// this.ctx.fillRect(8 * this.mmPerPixel, 157 * this.mmPerPixel, 142 * this.mmPerPixel, 10 * this.mmPerPixel);
	}

	public abstract drawLines(): void;
	
	public abstract execute(...parameters: Object[] ): any;
	
	protected abstract init(ctx: GraphicsContext): void;
}