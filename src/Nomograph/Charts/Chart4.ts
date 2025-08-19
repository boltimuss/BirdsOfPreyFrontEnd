import { Chart } from "../Chart";
import { Section } from "../Section";
import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Rectangle2D } from "../SupportObjects/Rectangle2D";
import { ScaleLabel } from "../Scale/ScaleLabel";
import { ShadedRegion } from "../ShadedRegion";
import { AbstractScale } from "../Scale/AbstractScale"; 
import { LabelSide } from "../LabelSide";
import { VerticalScale } from "../Scale/VerticalScale";
import { SlantScale } from "../Scale/SlantScale";

export class Chart4 extends Chart
{

	isDragging: boolean = false;
	dragOffset: number = 0;
	mouseStart: Point2D;
	noClick: boolean = false;

    public drawLines(): void 
    {
		this.draw(1.0);
		let maxLiftScale: AbstractScale | undefined = this.scales.get("maxLiftScale");
		let aeroLoadLimit: AbstractScale | undefined = this.scales.get("aeroLoadLimit");
		let currentAircraftId: string = this.gameState.currentAircraftId;
		if (maxLiftScale && aeroLoadLimit)
		{
			let x1: number = maxLiftScale.draggableX;
			let y1: number = maxLiftScale.draggableY;
			let x2: number = this.gameState.aircraftStates.get(currentAircraftId)["q-point"].x;
			let y2: number = this.gameState.aircraftStates.get(currentAircraftId)["q-point"].y;
			let slope: number = (y2 - y1) / (x2 - x1);
			let x3: number = aeroLoadLimit.scaleOffset.x * this.mmPerPixel;
			let y3: number = (slope * (x3 - x2)) + y2;

			this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x2, y2);
			this.ctx.strokeLine(x2, y2, x3, y3);
			this.ctx.setFill("red");
			this.ctx.fillOval(x2-3, y2+1, 6, 6);
			
			let loadLimit: number = aeroLoadLimit.getDataPointForSlideValue(y3);
			let xOffset: number = aeroLoadLimit.charactistics.labelSide == (LabelSide.LEFT) ? 0 : -40;

			this.gameState.aircraftStates.set(currentAircraftId, { 
					...this.gameState.aircraftStates.get(currentAircraftId), 
					 "aeroLoadLimit": loadLimit});

			this.ctx.setFill("black");
			this.ctx.setLineWidth(2);
			this.ctx.fillRect(x3 + 7 + xOffset, y3 - 7, 50, 16);
			this.ctx.setFill("white");
			this.ctx.fillRect(x3 + 8 + xOffset, y3 - 6, 48, 14);
			this.ctx.setFill("black");
			this.ctx.font("13px Sans");
			
			if (loadLimit > -999)
			{
				this.ctx.fillText((Math.ceil(loadLimit * 100) / 100).toFixed(2),x3 + 9 + xOffset, y3 + 5);
			}
			
			this.ctx.setFill("black");
			this.ctx.fillOval(x3 - 1, y3 + 1, 6, 6);
			
		}
    }
    
	public execute(...parameters: any[]): any
	{
		let maxLiftScale: AbstractScale | undefined = this.scales.get("maxLiftScale");
		let currentAircraftId: string = this.gameState.currentAircraftId;
		if (maxLiftScale && this.gameState.aircraftStates.get(currentAircraftId) && this.gameState.aircraftStates.get(currentAircraftId)["q-point"]) 
		{
			let y: number = maxLiftScale.draggableY;
			let offsetY: number = this.mmPerPixel * maxLiftScale.scaleOffset.y;
			if (y < offsetY + (this.mmPerPixel*maxLiftScale.mmStartOffset)) y = maxLiftScale.getPointForSlideValue(0).y;
			else if (y > offsetY + maxLiftScale.mmHeight*this.mmPerPixel) y = maxLiftScale.getPointForSlideValue(0).y;
			let clampResult: number = this.clampToscale(maxLiftScale.draggableX, maxLiftScale.draggableY);
			if (clampResult >= 0 || y <=  this.calcMaxLiftYForAeroLoadLimitY())
			{
				maxLiftScale.draggableY = y;
			}
			
			this.drawLines();
		}
		else
		{
			return;
		}
			
	}
	
	private initQScale(): SlantScale
	{
		let sections: Array<Section> = [];
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(true).setColor("black").setLabelSide(LabelSide.LEFT);

		let shadedRegions: Array<ShadedRegion> = [];
		shadedRegions.push(ShadedRegion.builder().setColor("yellow").setWidth(1.0).setUseYValue(true).setyMMStart(137).setyMMEnd(166.5));
		shadedRegions.push(ShadedRegion.builder().setColor("orange").setWidth(1.0).setUseYValue(true).setyMMStart(166.5).setyMMEnd(179));
		shadedRegions.push(ShadedRegion.builder().setColor("red").setWidth(1.0).setUseYValue(true).setyMMStart(179).setyMMEnd(194.75));


		let qScale: SlantScale = SlantScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(194.75)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(148, 20))
				.setDraggableOffset(new Point2D(0,0))
				.setShadedRegions(shadedRegions);
		
		qScale.setLabel(ScaleLabel.builder()
				.setLabel("Q-Mark")
				.setRotation(-90)
				.setLabelColor("yellow")
				.setStepNumColor("black")
				.setStepNum(" 4")
				.setScaleLocation(new Point2D(-350, 280))
				.setStepNumLocation(new Point2D(-370, 275)));
		
		qScale.init();
	
		return qScale;
	}

	private initAeroLoadLimit(): VerticalScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffset(6).setFontAxisOffsetLast(6).setMMHeight(137.5).setNumDivisions(25).setStartValue(12).setEndValue(0).setDrawLast(true));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11)
				.setTickWidthHeight(1)
				.setFontHeightOffset(.75)
				.setLineWidth(1)
				.setIsDescending(true)
				.setColor("black")
				.setLabelSide(LabelSide.LEFT);
		
		let aeroLoadLimit: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(137.5)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(10, 20))
				.setDraggableOffset(new Point2D(0,0));
		
		aeroLoadLimit.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("Aero Load Limit")
				.setLabelColor("yellow")
				.setStepNumColor("black")
				.setStepNum(" 4")
				.setRotation(180)
				.setScaleLocation(new Point2D(-156, 144))
				.setScaleOffset(new Point2D(122, 10))
				.setStepNumLocation(new Point2D(-39, 24)));
		
		aeroLoadLimit.init();
		
		return aeroLoadLimit;
	}

	private initMaxLiftScale(): VerticalScale
	{
		let sections: Array<Section> = [];

		sections.push(Section.builder().setFontAxisOffset(2).setFontAxisOffsetLast(2).setMMHeight(144.5).setNumDivisions(22).setStartValue(0).setEndValue(21).setDrawLast(true));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11)
				.setTickWidthHeight(1)
				.setFontHeightOffset(.75)
				.setLineWidth(1)
				.setIsDescending(false)
				.setColor("black")
				.setLabelSide(LabelSide.RIGHT);
		
		let maxLiftScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(144.5)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(148, 20))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D((146+this.scaleMargin) * this.mmPerPixel, 18 * this.mmPerPixel, 8 * this.mmPerPixel, 148 * this.mmPerPixel));
		
		maxLiftScale.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("Maximum Lift")
				.setLabelColor("yellow")
				.setStepNumColor("black")
				.setRotation(0)
				.setStepNum(" 4")
				.setScaleLocation(new Point2D(30, 334))
				.setScaleOffset(new Point2D(0, 64))
				.setStepNumLocation(new Point2D(34, 510)));
		
		maxLiftScale.init();
		maxLiftScale.showDraggable = true;
		maxLiftScale.isDragging= false;
		return maxLiftScale;
	}
	
	public handleMouseMove(x: number, y: number)
	{
		if (!this.isDragging) {
			return;
		}
		
		this.noClick = true;
		let maxLiftScale: AbstractScale | undefined = this.scales.get("maxLiftScale");

		if (maxLiftScale && !maxLiftScale.isDragging && maxLiftScale.isDraggingDot(x, y, this.scaleMargin, true))
		{
			maxLiftScale.isDragging = true;
		}
		
		if (maxLiftScale) 
		{
			let offsetY: number = this.mmPerPixel * maxLiftScale.scaleOffset.y;
			if (y < offsetY + (this.mmPerPixel*maxLiftScale.mmStartOffset)) return;
			else if (y > offsetY + maxLiftScale.mmHeight*this.mmPerPixel) return;
			let clampResult: number = this.clampToscale(maxLiftScale.draggableX, maxLiftScale.draggableY);
			if (clampResult >= 0 || y <=  this.calcMaxLiftYForAeroLoadLimitY())
			{
				maxLiftScale.draggableY = y;
			}
			
		}
		else
		{
			this.noClick = false;
			return;
		}
			
		this.drawLines();
	}

	private calcMaxLiftYForAeroLoadLimitY(): number
	{
		let maxLiftScale: AbstractScale | undefined = this.scales.get("maxLiftScale");
		let aeroLoadLimit: AbstractScale | undefined = this.scales.get("aeroLoadLimit");

		if (!maxLiftScale || !aeroLoadLimit) return 0;

		let currentAircraftId: string = this.gameState.currentAircraftId;
		let x1: number = aeroLoadLimit.scaleOffset.x * this.mmPerPixel;
		let y1: number = aeroLoadLimit.scaleOffset.y * this.mmPerPixel;
		let x2: number = this.gameState.aircraftStates.get(currentAircraftId)["q-point"].x;
		let y2: number = this.gameState.aircraftStates.get(currentAircraftId)["q-point"].y;
		let x3: number = maxLiftScale.scaleOffset.x * this.mmPerPixel;
		let slope = (y2 - y1) / (x2 - x1);
		return ((x3 - x2) * slope) + y2;
	}

	private clampToscale(maxLiftDragX: number, maxLiftDragY: number): number
	{

		let aeroLoadLimit: AbstractScale | undefined = this.scales.get("aeroLoadLimit"); 
		let currentAircraftId: string = this.gameState.currentAircraftId;
		if (aeroLoadLimit && "q-point" in this.gameState.aircraftStates.get(currentAircraftId)) 
		{
			let x3: number = maxLiftDragX;
			let y3: number = maxLiftDragY;
			let x2: number = this.gameState.aircraftStates.get(currentAircraftId)["q-point"].x;
			let y2: number = this.gameState.aircraftStates.get(currentAircraftId)["q-point"].y;
			let x1: number = aeroLoadLimit.scaleOffset.x * this.mmPerPixel;
			let slope: number = (y3 - y2) / (x3 - x2);
			let y1: number = y2 - (slope * (x2 - x1));

			let offsetY =  this.mmPerPixel * aeroLoadLimit.scaleOffset.y;

			if (y1 < offsetY + (this.mmPerPixel*aeroLoadLimit.mmStartOffset))
			{
				return -1;
			}
			else if (y1 > offsetY + (aeroLoadLimit.mmHeight*this.mmPerPixel))
			{
				return 1;
			}
		}
		
		return 0;
	}

	public handleMouseUp(x: number, y: number)
	{
		this.isDragging = false;
		let maxLiftScale: AbstractScale | undefined = this.scales.get("maxLiftScale");

		if (maxLiftScale) maxLiftScale.isDragging= false;
	}

	public handleMouseDown(x: number, y: number)
	{
		this.dragOffset = 0;
		this.mouseStart = new Point2D(x, y);
		this.isDragging = true;
	}

	protected init(): void 
	{
		this.scales.set("qScale", this.initQScale());
		this.scales.set("maxLiftScale", this.initMaxLiftScale());
		this.scales.set("aeroLoadLimit", this.initAeroLoadLimit());
	}
}