import { Chart } from "../Chart";
import { GameState } from "../../State/GameState";
import { Section } from "../Section";
import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Rectangle2D } from "../SupportObjects/Rectangle2D";
import { ScaleLabel } from "../Scale/ScaleLabel";
import { ShadedRegion } from "../ShadedRegion";
import { AbstractScale } from "../Scale/AbstractScale"; 
import { LabelSide } from "../LabelSide";
import { VerticalScale } from "../Scale/VerticalScale";
import { HorizontalScale } from "../Scale/HorizontalScale";
import { SlantScale } from "../Scale/SlantScale";

export class Chart3 extends Chart
{

	isDragging: boolean = false;
	dragOffset: number = 0;
	mouseStart: Point2D;
	noClick: boolean = false;

    public drawLines(): void 
    {
		this.draw(1.0);
		let wingLoadScale: AbstractScale | undefined = this.scales.get("wingLoadScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");
		
		if (wingLoadScale && wingLoadScale.isShowDraggable() && keasLowScale && keasLowScale.isShowDraggable())
		{
			let x1: number = wingLoadScale.draggableX;
			let y1: number = wingLoadScale.draggableY;
			let x2: number = keasLowScale.draggableX;
			let y2: number = keasLowScale.draggableY;
			
			let slope: number = -((y2 - y1) / (x2 - x1));
			let xOffset: number =keasLowScale.scaleOffset.x * this.mmPerPixel;
			let b2: number = (-slope*(x2-xOffset)); 
			
			let intersectionPt: Point2D | null = this.calculateIntersectionPoint(1.0, 0.0, slope, b2);
			
			let xInt: number = (intersectionPt) ? intersectionPt.x + xOffset : 0;
			let yInt: number = (intersectionPt) ? y2 - intersectionPt.y : 0;
			
			let currentAircraftId: string = this.gameState.currentAircraftId;
			this.gameState.aircraftStates.set(currentAircraftId, {"q-point": new Point2D(xInt, yInt)});
			
			this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x2, y2);
			wingLoadScale.drawDraggableNotch(this.ctx);
			keasLowScale.drawDraggableNotch(this.ctx);
			
			this.ctx.setFill("red");
			this.ctx.fillOval(xInt, yInt, 6, 6);
			
		}
		else if (wingLoadScale && wingLoadScale.isShowDraggable() && keasHighScale && keasHighScale.isShowDraggable())
		{
			let x1: number = wingLoadScale.draggableX;
			let y1: number = wingLoadScale.draggableY;
			let x2: number = keasHighScale.draggableX;
			let y2: number = keasHighScale.draggableY;
			
			let slope: number = -((y2 - y1) / (x2 - x1));
			let xOffset: number = keasHighScale.scaleOffset.x * this.mmPerPixel;
			let b2: number = (-slope*(x2-xOffset)); 
			
			let intersectionPt: Point2D | null = this.calculateIntersectionPoint(1.0, 0.0, slope, b2);
			
			let xInt = (intersectionPt) ? intersectionPt.x + xOffset : 0;
			let yInt = (intersectionPt) ? y2 - intersectionPt.y: 0;
			
			// String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
			// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setQPoint(new Point2D(xInt, yInt));
			
			this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x2, y2);
			wingLoadScale.drawDraggableNotch(this.ctx);
			keasHighScale.drawDraggableNotch(this.ctx);
			
			this.ctx.setFill("red");
			this.ctx.fillOval(xInt, yInt, 6, 6);
			
		}
		else
		{
			return;
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
				.setLabelColor("brown")
				.setStepNum(" 3")
				.setStepNumColor("white")
				.setScaleLocation(new Point2D(-350, 280))
				.setStepNumLocation(new Point2D(-370, 275)));
		
		qScale.init();
	
		return qScale;
	}

	private initKeasHighScale(): HorizontalScale
	{
		let sections: Array<Section> = [];
		
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(2.25).setNumDivisions(2).setStartValue(0).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(3).setNumDivisions(2).setStartValue(160).setEndValue(240));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(4).setNumDivisions(2).setStartValue(240).setEndValue(320));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(5.25).setNumDivisions(2).setStartValue(320).setEndValue(400));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(6.75).setNumDivisions(2).setStartValue(400).setEndValue(480));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(8).setNumDivisions(2).setStartValue(480).setEndValue(560));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(9).setNumDivisions(2).setStartValue(560).setEndValue(640));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(10.5).setNumDivisions(2).setStartValue(640).setEndValue(720));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(11.25).setNumDivisions(2).setStartValue(720).setEndValue(800));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(13).setNumDivisions(2).setStartValue(800).setEndValue(880));
		sections.push(Section.builder().setFontAxisOffset(2).setMMWidth(14).setNumDivisions(2).setStartValue(880).setEndValue(960));
		sections.push(Section.builder().setFontAxisOffsetLast(2).setDrawLast(true).setFontAxisOffset(2).setMMWidth(15.0).setNumDivisions(2).setStartValue(960).setEndValue(1040).setColor("purple"));
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11)
				.setTickWidthHeight(-1)
				.setFontHeightOffset(.75)
				.setLineWidth(1)
				.setIsDescending(false)
				.setColor("purple")
				.setRotation(90)
				.setRotationOffset(new Point2D(30, 7))
				.setLabelSide(LabelSide.LEFT);
		
		 let keasHighScale: HorizontalScale = HorizontalScale.builder()
			.setMMStartOffset(0)
			.setMMWidth(104.5)
			.setSections(sections)
			.setCharactistics(characteristics)
			.setScaleOffset(new Point2D(10, 158))
			.setClickZone(new Rectangle2D(8 * this.mmPerPixel, 166 * this.mmPerPixel, 148 * this.mmPerPixel, 8 * this.mmPerPixel))
			.setDraggableOffset(new Point2D(0, 135));

		keasHighScale.init();
		
		return keasHighScale;
	}
	
	private initKeasLowScale(): HorizontalScale
	{
		let sections: Array<Section> = [];

		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(2.25).setNumDivisions(2).setStartValue(0).setEndValue(80));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(3.0).setNumDivisions(2).setStartValue(80).setEndValue(120));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(4.0).setNumDivisions(2).setStartValue(120).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(5.25).setNumDivisions(2).setStartValue(160).setEndValue(200));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(6.75).setNumDivisions(2).setStartValue(200).setEndValue(240));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(8.0).setNumDivisions(2).setStartValue(240).setEndValue(280));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(9.0).setNumDivisions(2).setStartValue(280).setEndValue(320));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(10.5).setNumDivisions(2).setStartValue(320).setEndValue(360));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(11.25).setNumDivisions(2).setStartValue(360).setEndValue(400));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(13).setNumDivisions(2).setStartValue(400).setEndValue(440));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(14).setNumDivisions(2).setStartValue(440).setEndValue(480));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(15.0).setNumDivisions(2).setStartValue(480).setEndValue(520));
		sections.push(Section.builder().setFontAxisOffset(8).setMMWidth(17.0).setNumDivisions(2).setStartValue(520).setEndValue(560));
		sections.push(Section.builder().setFontAxisOffsetLast(8).setDrawLast(true).setFontAxisOffset(8).setMMWidth(17.5).setNumDivisions(2).setStartValue(560).setEndValue(600).setColor("black"));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11)
				.setTickWidthHeight(1)
				.setFontHeightOffset(.75)
				.setLineWidth(1)
				.setIsDescending(false)
				.setColor("black")
				.setLabelSide(LabelSide.LEFT)
				.setRotation(90)
				.setRotationOffset(new Point2D(-20, 7));
		
		let keasLowScale: HorizontalScale = HorizontalScale.builder()
				.setMMStartOffset(0)
				.setMMWidth(140)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(10, 158))
				.setDraggableOffset(new Point2D(0,135))
				.setClickZone(new Rectangle2D(8 * this.mmPerPixel, 158 * this.mmPerPixel, 148 * this.mmPerPixel, 8 * this.mmPerPixel));
		
		keasLowScale.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("KEAS")
				.setLabelColor("brown")
				.setStepNumColor("white")
				.setStepNum(" 3")
				.setScaleLocation(new Point2D(390, 50))
				.setScaleOffset(new Point2D(10, 0))
				.setStepNumLocation(new Point2D(455, 44)));
		
		keasLowScale.init();
		
		return keasLowScale;
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
				.setLabelColor("brown")
				.setStepNumColor("white")
				.setStepNum(" 3")
				.setScaleLocation(new Point2D(180, -46))
				.setScaleOffset(new Point2D(122, 10))
				.setStepNumLocation(new Point2D(390, -42)));
		
		wingLoadScale.init();
		
		return wingLoadScale;
	}
	
	public handleMouseMove(x: number, y: number)
	{
		if (!this.isDragging) {
			return;
		}
		
		this.noClick = true;
		let wingLoadScale: AbstractScale | undefined = this.scales.get("wingLoadScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (wingLoadScale && wingLoadScale.isDragging == false && keasLowScale && keasHighScale && !wingLoadScale.isDragging && wingLoadScale.isDraggingDot(x, y, this.scaleMargin, false))
		{
			wingLoadScale.isDragging = true;
			keasLowScale.isDragging = false;
			keasHighScale.isDragging = false;
		}
		else if (wingLoadScale && keasLowScale && keasLowScale.isDragging == false && keasHighScale && keasLowScale.isDraggingDot(x, y, this.scaleMargin, false) && (!keasLowScale.isDragging))
		{
			wingLoadScale.isDragging = false;
			keasLowScale.isDragging = true;
			keasHighScale.isDragging = false;
		}
		else if (wingLoadScale && keasLowScale && keasHighScale && keasHighScale.isDragging == false && keasHighScale.isDraggingDot(x, y, this.scaleMargin, false) && (!keasHighScale.isDragging))
		{
			wingLoadScale.isDragging = false;
			keasLowScale.isDragging = false;
			keasHighScale.isDragging = true;
		}
		
		if (wingLoadScale && wingLoadScale.isShowDraggable() && wingLoadScale.isDragging) 
		{
			let offsetX: number = this.mmPerPixel * wingLoadScale.scaleOffset.x + 44;
			if (x < offsetX + (this.mmPerPixel*wingLoadScale.mmStartOffset)) return;
			else if (x > offsetX + (wingLoadScale.mmWidth*this.mmPerPixel)) return;
			wingLoadScale.draggableX = x - 44;
		}
		else if (keasLowScale && keasLowScale.isShowDraggable() && keasLowScale.isDragging) 
		{
			let offsetX: number = this.mmPerPixel * keasLowScale.scaleOffset.x + 44;
			if (x < offsetX + (this.mmPerPixel*keasLowScale.mmStartOffset)) return;
			else if (x > offsetX + (keasLowScale.mmWidth*this.mmPerPixel)) return;
			keasLowScale.draggableX = x - 44;
		}
		else if (keasHighScale && keasHighScale.isShowDraggable() && keasHighScale.isDragging) 
		{
			let offsetX: number = this.mmPerPixel * keasHighScale.scaleOffset.x + 44;
			if (x < offsetX + (this.mmPerPixel*keasHighScale.mmStartOffset)) return;
			else if (x > offsetX + (keasHighScale.mmWidth*this.mmPerPixel)) return;
			keasHighScale.draggableX = x - 44;
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
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (wingLoadScale) wingLoadScale.isDragging= false;
		if (keasLowScale) keasLowScale.isDragging= false;
		if (keasHighScale) keasHighScale.isDragging= false;
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
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (wingLoadScale && wingLoadScale.containsClick(x, y))
		{
			wingLoadScale.showDraggable = !wingLoadScale.isShowDraggable();
		}
		else if (keasHighScale && keasLowScale && keasLowScale.containsClick(x, y))
		{
			keasLowScale.showDraggable = !keasLowScale.isShowDraggable();
			if (keasLowScale.isShowDraggable())
			{
				keasHighScale.showDraggable = false;
			}
		}
		else if (keasLowScale && keasHighScale && keasHighScale.containsClick(x, y))
		{
			keasHighScale.showDraggable = !keasHighScale.isShowDraggable();
			if (keasHighScale.isShowDraggable())
			{
				keasLowScale.showDraggable = false;
			}
		}
		else 
		{
			return;
		}
		
		this.drawLines();
	}

	protected init(): void 
	{
		this.scales.set("wingLoadScale", this.initWingLoadScale());
		this.scales.set("qScale", this.initQScale());
		this.scales.set("keasLowScale", this.initKeasLowScale());
		this.scales.set("keasHighScale", this.initKeasHighScale());
	}
}