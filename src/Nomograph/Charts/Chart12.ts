import { Chart } from "../Chart";
import { Section } from "../Section";
import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Rectangle2D } from "../SupportObjects/Rectangle2D";
import { ScaleLabel } from "../Scale/ScaleLabel";
import { ShadedRegion } from "../ShadedRegion";
import { AbstractScale } from "../Scale/AbstractScale"; 
import { LabelSide } from "../LabelSide";
import { SlantScale } from "../Scale/SlantScale";
import { HorizontalScale } from "../Scale/HorizontalScale";

export class Chart12 extends Chart 
{

	isDragging: boolean = false;
	dragOffset: number = 0;
	mouseStart: Point2D;
	noClick: boolean = false;

    public drawLines(): void 
    {
		this.draw(1.0);
		let wingLoadScale: AbstractScale | undefined = this.scales.get("wingLoadScale");
		let engineOutputScale: AbstractScale | undefined = this.scales.get("engineOutputScale");
		let engineDeltaSpeedScale: AbstractScale | undefined = this.scales.get("engineDeltaSpeedScale");
		
		if (engineDeltaSpeedScale && wingLoadScale && wingLoadScale.isShowDraggable() && engineOutputScale && engineOutputScale.isShowDraggable())
		{
			let x1: number = wingLoadScale.draggableX;
			let y1: number = wingLoadScale.draggableY;
			let x2: number = engineOutputScale.draggableX;
			let y2: number = engineOutputScale.draggableY;
			
			let slope: number = -((y2 - y1) / (x2 - x1));
			let xOffset: number = engineOutputScale.scaleOffset.x * this.mmPerPixel;
			let b2: number = (-slope*(x2-xOffset)); 
			
			let intersectionPt: Point2D | null = this.calculateIntersectionPoint(1.0, 0.0, slope, b2);
			
			let xInt: number = (intersectionPt) ? intersectionPt.x + xOffset : 0;
			let yInt: number = (intersectionPt) ? y2 - intersectionPt.y : 0;
			engineDeltaSpeedScale.value = engineDeltaSpeedScale.getSlideValueForPoint(yInt);

			let currentAircraftId: string = this.gameState.currentAircraftId;
			this.gameState.aircraftStates.set(currentAircraftId, {"q-point": new Point2D(xInt, yInt)});
			
			this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x2, y2);
			wingLoadScale.drawDraggableNotch(this.ctx);
			
			this.ctx.setFill("red");
			this.ctx.fillOval(xInt, yInt, 6, 6);
			
		}
		else
		{
			return;
		}

		if (engineDeltaSpeedScale)
		{

		}
    }
    
	public execute(...parameters: any[]): any
	{
		// double wingload = (double) parameters[0];
		// double keasLow = (double) parameters[1];
		// double keasHigh = (double) parameters[2];
		// boolean useHigh = (boolean) parameters[3];
		
		// double x1 = getScales().get("wingLoadScale").getPointForSlideValue(wingload).getX();
		// double y1 = getScales().get("wingLoadScale").getDraggableY();
		// double x2 = (useHigh) ? getScales().get("keasHighScale").getPointForSlideValue(keasHigh).getX() : getScales().get("keasLowScale").getPointForSlideValue(keasLow).getX();
		// double y2 = (useHigh) ? getScales().get("keasHighScale").getDraggableY() : getScales().get("keasLowScale").getDraggableY();
		
		// double slope = -((y2 - y1) / (x2 - x1));
		// double xOffset = getScales().get("keasLowScale").getScaleOffset().getX() * mmPerPixel;
		// double b2 = (-slope*(x2-xOffset)); 
		
		// Point2D intersectionPt = calculateIntersectionPoint(1.0, 0.0, slope, b2);
		
		// double xInt = intersectionPt.getX() + xOffset;
		// double yInt = y2 - intersectionPt.getY(); 
	    
		// String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
		// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setQPoint(new Point2D(xInt, yInt));
		
		// return new Point2D(xInt, yInt);
	}
	
	private initWingLoadScale(): HorizontalScale
	{
		let sections: Array<Section> = [];

		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(5.75).setNumDivisions(2).setStartValue(208.5).setEndValue(200));
		sections.push(Section.builder().setFontAxisOffsetLast(8).setDrawLast(true).setFontAxisOffset(8).setMMWidth(132.25).setNumDivisions(21).setStartValue(200).setEndValue(0).setColor("black"));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11)
				.setTickWidthHeight(1)
				.setFontHeightOffset(.75)
				.setLineWidth(1)
				.setIsDescending(true)
				.setColor("black")
				.setLabelSide(LabelSide.RIGHT)
				.setRotation(-90)
				.setRotationOffset(new Point2D(-20, 1));
		
		let wingLoadScale: HorizontalScale = HorizontalScale.builder()
				.setMMStartOffset(0)
				.setMMWidth(138)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(10, 20))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D(8 * this.mmPerPixel, 10 * this.mmPerPixel, 142 * this.mmPerPixel, 8 * this.mmPerPixel));
		
		wingLoadScale.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("Wing-Load")
				.setLabelColor("#358ee2ff")
				.setStepNumColor("white")
				.setStepNum("12")
				.setScaleLocation(new Point2D(180, -46))
				.setScaleOffset(new Point2D(122, 10))
				.setStepNumLocation(new Point2D(390, -42)));
		
		wingLoadScale.init();
		
		return wingLoadScale;
	}

	private initEngineOutputScale(): HorizontalScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffsetLast(8).setDrawLast(false).setFontAxisOffset(8).setMMWidth(138).setNumDivisions(51).setStartValue(0).setEndValue(50).setColor("black"));
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
		.setFontSize(11)
		.setTickWidthHeight(1)
		.setFontHeightOffset(.75)
		.setLineWidth(1)
		.setIsDescending(false)
		.setColor("black")
		.setRotation(90)
		.setRotationOffset(new Point2D(-20, 6))
		.setLabelSide(LabelSide.LEFT);

		let engineOutputScale: HorizontalScale = HorizontalScale.builder()
				.setMMStartOffset(0)
				.setMMWidth(138)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(10, 158))
				.setClickZone(new Rectangle2D(8 * this.mmPerPixel, 157 * this.mmPerPixel, 142 * this.mmPerPixel, 10 * this.mmPerPixel))
				.setDraggableOffset(new Point2D(0, 135));
		
		engineOutputScale.setLabel(ScaleLabel.builder()
				.setLabel("Engine Output")
				.setLabelColor("#358ee2ff")
				.setStepNumColor("white")
				.setStepNum("12")
				.setScaleLocation(new Point2D(208, -10))
				.setStepNumLocation(new Point2D(330, -17)));
		
		engineOutputScale.init();
	
		return engineOutputScale;
	}

	private initEngineDeltaSpeedScale(): SlantScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(4.5).setNumDivisions(2).setStartValue(200).setEndValue(180));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(5).setNumDivisions(2).setStartValue(180).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(3).setNumDivisions(2).setStartValue(160).setEndValue(150));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(3.25).setNumDivisions(2).setStartValue(150).setEndValue(140));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(3.5).setNumDivisions(2).setStartValue(140).setEndValue(130));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(3.75).setNumDivisions(2).setStartValue(130).setEndValue(120));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(4.25).setNumDivisions(2).setStartValue(120).setEndValue(110));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(4.5).setNumDivisions(2).setStartValue(110).setEndValue(100));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(5).setNumDivisions(2).setStartValue(100).setEndValue(90));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(5.75).setNumDivisions(2).setStartValue(90).setEndValue(80));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(6.5).setNumDivisions(2).setStartValue(80).setEndValue(70));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(7.5).setNumDivisions(2).setStartValue(70).setEndValue(60));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(8.5).setNumDivisions(2).setStartValue(60).setEndValue(50));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(9.75).setNumDivisions(2).setStartValue(50).setEndValue(40));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(11.5).setNumDivisions(2).setStartValue(40).setEndValue(30));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(14).setNumDivisions(2).setStartValue(30).setEndValue(20));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(17).setNumDivisions(2).setStartValue(20).setEndValue(10));
		sections.push(Section.builder().setFontAxisOffsetLast(2).setDrawLast(true).setFontAxisOffset(2).setMMHeight(21).setNumDivisions(2).setStartValue(10).setEndValue(0).setColor("black"));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11)
				.setTickWidthHeight(1)
				.setFontHeightOffset(.75)
				.setLineWidth(1)
				.setIsDescending(true)
				.setColor("black")
				.setLabelSide(LabelSide.RIGHT);
		
		let engineDeltaSpeedScale: SlantScale = SlantScale.builder()
				.setMMStartOffset(57)
				.setMMHeight(194.75)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(148, 20))
				.setDraggableOffset(new Point2D(0,0));
		
		engineDeltaSpeedScale.setLabel(ScaleLabel.builder()
				.setDrawValue(true)
				.setLabel("Engine Delta Speed")
				.setLabelColor("#358ee2ff")
				.setStepNumColor("white")
				.setStepNum("12")
				.setRotation(-135)
				.setScaleLocation(new Point2D(-290, 210))
				.setScaleOffset(new Point2D(148, 10))
				.setStepNumLocation(new Point2D(-174, 235)));
		
		engineDeltaSpeedScale.init();
		
		return engineDeltaSpeedScale;
	}

	public handleMouseMove(x: number, y: number)
	{
		if (!this.isDragging) {
			return;
		}
		
		this.noClick = true;
		let wingLoadScale: AbstractScale | undefined = this.scales.get("wingLoadScale");
		let engineDeltaSpeedScale: AbstractScale | undefined = this.scales.get("engineOutputScale");

		if (wingLoadScale && wingLoadScale.isDragging == false && engineDeltaSpeedScale && wingLoadScale.isDraggingDot(x, y, this.scaleMargin, false))
		{
			wingLoadScale.isDragging = true;
			engineDeltaSpeedScale.isDragging = false;
		}
		else if (engineDeltaSpeedScale && engineDeltaSpeedScale.isDragging == false && wingLoadScale && engineDeltaSpeedScale.isDraggingDot(x, y, this.scaleMargin, false))
		{
			wingLoadScale.isDragging = false;
			engineDeltaSpeedScale.isDragging = true;
		}
		
		if (wingLoadScale && wingLoadScale.isShowDraggable() && wingLoadScale.isDragging) 
		{
			let offsetX: number = this.mmPerPixel * wingLoadScale.scaleOffset.x + 44;
			if (x < offsetX + (this.mmPerPixel*wingLoadScale.mmStartOffset)) return;
			else if (x > offsetX + (wingLoadScale.mmWidth*this.mmPerPixel)) return;
			wingLoadScale.draggableX = x - 44;
		}
		else if (engineDeltaSpeedScale && engineDeltaSpeedScale.isShowDraggable() && engineDeltaSpeedScale.isDragging) 
		{
			let offsetX: number = this.mmPerPixel * engineDeltaSpeedScale.scaleOffset.x + 44;
			if (x < offsetX + (this.mmPerPixel*engineDeltaSpeedScale.mmStartOffset)) return;
			else if (x > offsetX + (engineDeltaSpeedScale.mmWidth*this.mmPerPixel)) return;
			engineDeltaSpeedScale.draggableX = x - 44;
		}
		else
		{
			return;
		}
		
		this.drawLines();
	}


	public handleMouseUp(x: number, y: number)
	{
		this.isDragging = false;

		let wingLoadScale: AbstractScale | undefined = this.scales.get("wingLoadScale");
		let engineDeltaSpeedScale: AbstractScale | undefined = this.scales.get("engineOutputScale");

		if (wingLoadScale) wingLoadScale.isDragging= false;
		if (engineDeltaSpeedScale) engineDeltaSpeedScale.isDragging= false;
	}

	public handleMouseDown(x: number, y: number)
	{
		this.dragOffset = 0;
		this.mouseStart = new Point2D(x, y);
		this.isDragging = true;
	}

	public handleMouseClick(x: number, y: number)
	{
		if (this.noClick)
		{
			this.noClick = false;
			return;
		}
		this.isDragging = false;
		let wingLoadScale: AbstractScale | undefined = this.scales.get("wingLoadScale");
		let engineOutputScale: AbstractScale | undefined = this.scales.get("engineOutputScale");

		if (wingLoadScale && wingLoadScale.containsClick(x, y))
		{
			wingLoadScale.showDraggable = !wingLoadScale.showDraggable;
		}
		else if (engineOutputScale && engineOutputScale.containsClick(x, y))
		{
			engineOutputScale.showDraggable = !engineOutputScale.showDraggable;
		}
		else 
		{
			return;
		}
		
		this.drawLines();
	}

	protected init(): void 
	{
		this.scales.set("engineDeltaSpeedScale", this.initEngineDeltaSpeedScale());
		this.scales.set("engineOutputScale", this.initEngineOutputScale());
		this.scales.set("wingLoadScale", this.initWingLoadScale());
	}
}