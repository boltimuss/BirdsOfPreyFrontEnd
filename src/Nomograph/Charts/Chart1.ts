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

export class Chart1 extends Chart
{

	isDragging: boolean = false;
	dragOffset: number = 0;
	mouseStart: Point2D;
	noClick: boolean = false;

    public drawLines(): void 
    {
		this.draw(1.0);
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let speedLow: AbstractScale | undefined = this.scales.get("speedLow");
		let speedHigh: AbstractScale | undefined = this.scales.get("speedHigh");

		if (altitudeScale !== undefined && altitudeScale.isShowDraggable() && 
		    speedLow !== undefined && speedLow.isShowDraggable())
		{
			let x1: number = altitudeScale.draggableX;
			let y1: number = altitudeScale.draggableY;
			let x2: number = speedLow.draggableX;
			let y2: number = speedLow.draggableY;
			
			this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x2, y2);
		}
		else if (altitudeScale !== undefined && altitudeScale.isShowDraggable() && 
		            speedHigh !== undefined && speedHigh.isShowDraggable())
		{
			let x1: number = altitudeScale.draggableX;
			let y1: number = altitudeScale.draggableY;
			let x2: number = speedHigh.draggableX;
			let y2: number = speedHigh.draggableY;
			
            this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x2, y2);
		}
		
    }
    
    private getKeasLow(altitudeY: number, speedLowY: number): number
	{
		let altitudeScale: AbstractScale | undefined =this.scales.get("altitudeScale");
		let speedLow: AbstractScale | undefined = this.scales.get("speedLow");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");

		if (altitudeScale == undefined || speedLow == undefined || keasLowScale == undefined) return 0;

		let altX: number = altitudeScale.scaleOffset.x * this.mmPerPixel;
		let altY: number  = altitudeY;
		let speedX: number  = speedLow.scaleOffset.x * this.mmPerPixel;
		let speedY: number  = speedLowY;
		let slope: number  = (speedY - altY) / (speedX - altX);
		let keasLowinterceptX: number  = keasLowScale.scaleOffset.x * this.mmPerPixel;
		let keasLowinterceptY: number  = altY + (slope * (keasLowinterceptX - altX));
		
		return keasLowScale.getDataPointForSlideValue(keasLowinterceptY);
	}
	
	private getKeasHigh(altitudeY: number, speedHighY: number): number
	{
		let altitudeScale: AbstractScale | undefined =this.scales.get("altitudeScale");
		let speedHigh: AbstractScale | undefined = this.scales.get("speedLow");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (altitudeScale == undefined || speedHigh == undefined || keasHighScale == undefined) return 0;

		let altX: number = altitudeScale.scaleOffset.x * this.mmPerPixel;
		let altY: number = altitudeY;
		let speedX: number = speedHigh.scaleOffset.x * this.mmPerPixel;
		let speedY: number = speedHighY;
		let slope: number = (speedY - altY) / (speedX - altX);
		let keasHighinterceptX: number = keasHighScale.scaleOffset.x * this.mmPerPixel;
		let keashighinterceptY: number = altY + (slope * (keasHighinterceptX - altX));
		
		return keasHighScale.getDataPointForSlideValue(keashighinterceptY);
	}
	
	public execute(...parameters: any[]): any
	{
		let altitude: number = parameters[0];
		let speedHighValue: number = parameters[1];
		let speedLowValue: number = parameters[2];
		let useHigh: boolean = parameters[3];
		
		let altitudeScale: AbstractScale | undefined =this.scales.get("altitudeScale");
		let speedHigh: AbstractScale | undefined = this.scales.get("speedLow");
		let speedLow: AbstractScale | undefined = this.scales.get("keasLowScale");

		if (useHigh && altitudeScale !== undefined && speedHigh !== undefined && speedLow !== undefined)
		{
			let value:number = this.getKeasHigh(altitudeScale.getPointForSlideValue(altitude).y, speedHigh.getPointForSlideValue(speedHighValue).y);
			let currentAircraftId: string  = GameState.getInstanceOf().currentAircraft;
			GameState.getInstanceOf().aircraftStates.get(currentAircraftId).setKeas(value);
			return value;
		}
		else if (altitudeScale !== undefined && speedLow !== undefined)
		{
			let value: number = this.getKeasLow(altitudeScale.getPointForSlideValue(altitude).y, speedLow.getPointForSlideValue(speedLowValue).y);
			let currentAircraftId: string  = GameState.getInstanceOf().currentAircraft;
			GameState.getInstanceOf().aircraftStates.get(currentAircraftId).setKeas(value);
			return value;
		}
	}
	
	private initAltitudeScale(): VerticalScale
	{
		let sections: Array<Section> = [];
		
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(10).setNumDivisions(4).setStartValue(320).setEndValue(290).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.25).setNumDivisions(2).setStartValue(290).setEndValue(280).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(9.5).setNumDivisions(4).setStartValue(280).setEndValue(250).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.5).setNumDivisions(2).setStartValue(250).setEndValue(240).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(10).setNumDivisions(4).setStartValue(240).setEndValue(210).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.5).setNumDivisions(2).setStartValue(210).setEndValue(200).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(9).setNumDivisions(4).setStartValue(200).setEndValue(170).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.75).setNumDivisions(2).setStartValue(170).setEndValue(160).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(10).setNumDivisions(5).setStartValue(160).setEndValue(120).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.5).setNumDivisions(2).setStartValue(120).setEndValue(110).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.5).setNumDivisions(2).setStartValue(110).setEndValue(100).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.25).setNumDivisions(2).setStartValue(100).setEndValue(90).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.5).setNumDivisions(3).setStartValue(90).setEndValue(70).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(2.25).setNumDivisions(2).setStartValue(70).setEndValue(60).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.5).setNumDivisions(3).setStartValue(60).setEndValue(40).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(2.0).setNumDivisions(2).setStartValue(40).setEndValue(30).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(2).setNumDivisions(2).setStartValue(30).setEndValue(20).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(2).setNumDivisions(2).setStartValue(20).setEndValue(10).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setFontAxisOffsetLast(6).setMMHeight(2).setNumDivisions(2).setStartValue(10).setEndValue(0).setDrawLast(true));
		
	 	let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(true).setColor("black").setLabelSide(LabelSide.LEFT);
		
		let altitudeScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(7)
				.setMMHeight(95)
				.setSections(sections) 
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(10, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D(this.scaleMargin * this.mmPerPixel, 10 * this.mmPerPixel, 35, 212 * this.mmPerPixel));
		
		altitudeScale.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("Altitude")
				.setLabelColor("brown")
				.setStepNum(" 1")
				.setStepNumColor("white")
				.setScaleLocation(new Point2D(6, -8))
				.setStepNumLocation(new Point2D(2, -25)));
		
		altitudeScale.init();
		
		return altitudeScale;
	}
	
	private initKeasHighScale(): VerticalScale
	{
		let sections: Array<Section> = [];
		
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(10).setNumDivisions(2).setStartValue(60).setEndValue(80));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(13.5).setNumDivisions(2).setStartValue(80).setEndValue(120));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(9.5).setNumDivisions(2).setStartValue(120).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(7.25).setNumDivisions(2).setStartValue(160).setEndValue(200));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(6).setNumDivisions(2).setStartValue(200).setEndValue(240));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(5.25).setNumDivisions(2).setStartValue(240).setEndValue(280));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4.5).setNumDivisions(2).setStartValue(280).setEndValue(320));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4).setNumDivisions(2).setStartValue(320).setEndValue(360));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.5).setNumDivisions(2).setStartValue(360).setEndValue(400));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.25).setNumDivisions(2).setStartValue(400).setEndValue(440));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3).setNumDivisions(2).setStartValue(440).setEndValue(480));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.5).setNumDivisions(2).setStartValue(480).setEndValue(520));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.5).setNumDivisions(2).setStartValue(520).setEndValue(560));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.25).setNumDivisions(2).setStartValue(560).setEndValue(600));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4.25).setNumDivisions(2).setStartValue(600).setEndValue(680));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.75).setNumDivisions(2).setStartValue(680).setEndValue(760));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4.25).setNumDivisions(2).setStartValue(760).setEndValue(840));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.5).setNumDivisions(2).setStartValue(840).setEndValue(920).setColor("orange"));
		sections.push(Section.builder().setFontAxisOffsetLast(9).setDrawLast(true).setFontAxisOffset(8).setMMHeight(2.75).setNumDivisions(2).setStartValue(920).setEndValue(1000).setColor("orange"));
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("purple").setLabelSide(LabelSide.LEFT);

		let shadedRegions: Array<ShadedRegion> = [];
		shadedRegions.push(ShadedRegion.builder().setColor("red").setWidth(1.0).setStartValue(800).setEndValue(1000).setUseYValue(true).setyMMStart(87).setyMMEnd(95.5));
		
		let keasHighScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(95.5)
				.setSections(sections) 
				.setCharactistics(characteristics)
				.setDraggableOffset(new Point2D(0, 0))
				.setScaleOffset(new Point2D(43, 10))
				.setShadedRegions(shadedRegions);

		keasHighScale.setLabel(ScaleLabel.builder()
				.setDrawValue(true)
				.setLabel("KEAS")
				.setLabelColor("brown")
				.setStepNumColor("white")
				.setStepNum("1")
				.setScaleLocation(new Point2D(13, -6))
				.setStepNumLocation(new Point2D(0, -25)));
		
		keasHighScale.init();
		
		return keasHighScale;
	}
	
	private initKeasLowScale(): VerticalScale
	{
		let sections: Array<Section> = [];

		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(20.5).setNumDivisions(2).setStartValue(20).setEndValue(40));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(12).setNumDivisions(2).setStartValue(40).setEndValue(60));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(8.5).setNumDivisions(2).setStartValue(60).setEndValue(80));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(6.5).setNumDivisions(2).setStartValue(80).setEndValue(100));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(5.5).setNumDivisions(2).setStartValue(100).setEndValue(120));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(4.5).setNumDivisions(2).setStartValue(120).setEndValue(140));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(4).setNumDivisions(2).setStartValue(140).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(3.5).setNumDivisions(2).setStartValue(160).setEndValue(180));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(3.5).setNumDivisions(2).setStartValue(180).setEndValue(200));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(3).setNumDivisions(2).setStartValue(200).setEndValue(220));
		sections.push(Section.builder().setDrawLast(true).setFontAxisOffsetLast(3).setFontAxisOffset(3).setMMHeight(3.5).setNumDivisions(2).setStartValue(220).setEndValue(240));
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("black").setLabelSide(LabelSide.RIGHT);
		
		let keasLowScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(75)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(47, 30.5))
				.setDraggableOffset(new Point2D(0,0));
		
		keasLowScale.setLabel(ScaleLabel.builder()
				.setDrawValue(true)
				.setLabel("KEAS")
				.setLabelColor("brown")
				.setStepNum("1")
				.setStepNumColor("white")
				.setScaleLocation(new Point2D(13, -6))
				.setScaleOffset(new Point2D(14, 0))
				.setStepNumLocation(new Point2D(0, -25)));
		
		keasLowScale.init();
		
		return keasLowScale;
	}
	
	private initSpeedHigh(): VerticalScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(10).setNumDivisions(2).setStartValue(240).setEndValue(280));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(9).setNumDivisions(2).setStartValue(280).setEndValue(320));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(7.75).setNumDivisions(2).setStartValue(320).setEndValue(360));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(7).setNumDivisions(2).setStartValue(360).setEndValue(400));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(6.5).setNumDivisions(2).setStartValue(400).setEndValue(440));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(5.75).setNumDivisions(2).setStartValue(440).setEndValue(480));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(5.5).setNumDivisions(2).setStartValue(480).setEndValue(520));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(5).setNumDivisions(2).setStartValue(520).setEndValue(560));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4.5).setNumDivisions(2).setStartValue(560).setEndValue(600));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4.5).setNumDivisions(2).setStartValue(600).setEndValue(640));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4).setNumDivisions(2).setStartValue(640).setEndValue(680));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.75).setNumDivisions(2).setStartValue(680).setEndValue(720));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.75).setNumDivisions(2).setStartValue(720).setEndValue(760));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.5).setNumDivisions(2).setStartValue(760).setEndValue(800));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3.35).setNumDivisions(2).setStartValue(800).setEndValue(840));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3).setNumDivisions(2).setStartValue(840).setEndValue(880));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(3).setNumDivisions(2).setStartValue(880).setEndValue(920));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.75).setNumDivisions(2).setStartValue(920).setEndValue(960));
		sections.push(Section.builder().setDrawLast(true).setFontAxisOffsetLast(8).setFontAxisOffset(8).setMMHeight(2.5).setNumDivisions(2).setStartValue(960).setEndValue(1000));
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("purple").setLabelSide(LabelSide.LEFT);
		
		let speedHigh: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(95)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(76, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D((67 + this.scaleMargin) * this.mmPerPixel, 8 * this.mmPerPixel, 35, 100 * this.mmPerPixel));
		
		speedHigh.init();
		
		return speedHigh;
	}
	
	private initSpeedLow(): VerticalScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(21.5).setNumDivisions(2).setStartValue(40).setEndValue(60));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(15.25).setNumDivisions(2).setStartValue(60).setEndValue(80));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(12).setNumDivisions(2).setStartValue(80).setEndValue(100));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(9.5).setNumDivisions(2).setStartValue(100).setEndValue(120));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(8.25).setNumDivisions(2).setStartValue(120).setEndValue(140));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(7).setNumDivisions(2).setStartValue(140).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(6.25).setNumDivisions(2).setStartValue(160).setEndValue(180));
		sections.push(Section.builder().setFontAxisOffset(3).setMMHeight(5.75).setNumDivisions(2).setStartValue(180).setEndValue(200));
		sections.push(Section.builder().setDrawLast(true).setFontAxisOffsetLast(3).setFontAxisOffset(3).setMMHeight(9.65).setNumDivisions(3).setStartValue(200).setEndValue(240));
		 	
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("black").setLabelSide(LabelSide.RIGHT);
		
		let speedLow: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(95)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(76, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D((78 + this.scaleMargin) * this.mmPerPixel, 8 * this.mmPerPixel, 38, 212 * this.mmPerPixel));
		
		speedLow.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("Speed")
				.setLabelColor("brown")
				.setStepNum(" 1")
				.setStepNumColor("white")
				.setScaleLocation(new Point2D(-40, -30))
				.setStepNumLocation(new Point2D(2, -23)));
		
		speedLow.init();
		
		return speedLow;
	}

	public handleMouseMove(x: number, y: number)
	{
		if (!this.isDragging) {
			return;
		}

		this.noClick = true;
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let speedLow: AbstractScale | undefined = this.scales.get("speedLow");
		let speedHigh: AbstractScale | undefined = this.scales.get("speedHigh");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (altitudeScale && !altitudeScale.isDragging && altitudeScale.isDraggingDot(x, y, this.scaleMargin, true))
		{
			altitudeScale.isDragging = true;
			if (speedHigh) speedHigh.isDragging = false;
			if (speedLow) speedLow.isDragging = false;
		}
		else if (speedLow && !speedLow.isDragging && speedLow.isDraggingDot(x, y, this.scaleMargin, true))
		{
			speedLow.isDragging = true;
			if (speedHigh) speedHigh.isDragging = false;
			if (altitudeScale) altitudeScale.isDragging = false;
		}
		else if (speedHigh && !speedHigh.isDragging && speedHigh.isDraggingDot(x, y, this.scaleMargin, true))
		{
			speedHigh.isDragging = true;
			if (speedLow) speedLow.isDragging = false;
			if (altitudeScale) altitudeScale.isDragging = false;
		}
		
		if (altitudeScale && altitudeScale.showDraggable && altitudeScale.isDragging) 
		{
			let offsetY: number = this.mmPerPixel * altitudeScale.scaleOffset.y;

			if (y< offsetY + (this.mmPerPixel*altitudeScale.mmStartOffset)) return;
			else if (y > offsetY + (altitudeScale.mmHeight*this.mmPerPixel)) return;
			altitudeScale.draggableY = y;
			
			if (speedLow && speedLow.showDraggable)
			{
				if (keasLowScale) keasLowScale.value = this.getKeasLow(altitudeScale.draggableY, speedLow.draggableY);
				if (keasHighScale) keasHighScale.value = 0.0;

				let currentAircraftId: string = GameState.getInstanceOf().currentAircraft;
				// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setKeas(getScales().get("keasLowScale").getValue());
			}
			else if (speedHigh && speedHigh.showDraggable)
			{
				if (keasLowScale) keasLowScale.value = 0.0;
				if (keasHighScale) keasHighScale.value = this.getKeasHigh(altitudeScale.draggableY, speedHigh.draggableY);
				// String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
				// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setKeas(getScales().get("keasHighScale").getValue());
			}
		}
		else if (speedLow && speedLow.showDraggable && speedLow.isDragging) 
		{
			if (keasHighScale) keasHighScale.value = 0.0;
			let offsetY:number = this.mmPerPixel * speedLow.scaleOffset.y;
			if (y < offsetY + (this.mmPerPixel*speedLow.mmStartOffset)) return;
			else if (y > offsetY + (speedLow.mmHeight*this.mmPerPixel)) return;
			speedLow.draggableY = y;
			if (keasLowScale && altitudeScale && speedLow) keasLowScale.value = this.getKeasLow(altitudeScale.draggableY, speedLow.draggableY);
			// let currentAircraftId:string = GameState.getInstanceOf().currentAircraft;
			// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setKeas(getScales().get("keasLowScale").getValue());
		}
		else if (speedHigh && speedHigh.showDraggable && speedHigh.isDragging)
		{
			if (keasLowScale) keasLowScale.value = 0.0;
			let offsetY: number = this.mmPerPixel * speedHigh.scaleOffset.y;
			if (y < offsetY + (this.mmPerPixel*speedHigh.mmStartOffset)) return;
			else if (y > offsetY + (speedHigh.mmHeight*this.mmPerPixel)) return;
			speedHigh.draggableY = y;
			if (keasHighScale && altitudeScale && speedHigh)  keasHighScale.value = this.getKeasHigh(altitudeScale.draggableY, speedHigh.draggableY);
			// String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
			// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setKeas(getScales().get("keasHighScale").getValue());
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
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let speedLow: AbstractScale | undefined = this.scales.get("speedLow");
		let speedHigh: AbstractScale | undefined = this.scales.get("speedHigh");

		if (altitudeScale) altitudeScale.isDragging= false;
		if (speedLow) speedLow.isDragging= false;
		if (speedHigh) speedHigh.isDragging= false;
	}

	private isInRect= (x: number, y: number, dimensions: Rectangle2D) => {
    	return x >= dimensions.getMinX() && x <= dimensions.getMaxX() && y >= dimensions.getMinY() && x <= dimensions.getMaxY();
  	};

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
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let speedLow: AbstractScale | undefined = this.scales.get("speedLow");
		let speedHigh: AbstractScale | undefined = this.scales.get("speedHigh");

		if (altitudeScale && altitudeScale.containsClick(x, y))
		{
			altitudeScale.showDraggable = !altitudeScale.isShowDraggable();
		}
		else if (speedLow && speedLow.containsClick(x, y) && speedHigh)
		{
			speedHigh.showDraggable = false;
			speedLow.showDraggable = !speedLow.isShowDraggable();
		}
		else if (speedHigh && speedHigh.containsClick(x, y) && speedLow)
		{
			speedLow.showDraggable = false;
			speedHigh.showDraggable = !speedHigh.isShowDraggable();
		}
		else 
		{
			return;
		}
		
		this.draw(1.0);
		this.drawLines();
	}

	protected init(): void 
	{
		
		this.scales.set("altitudeScale", this.initAltitudeScale());
		this.scales.set("keasHighScale", this.initKeasHighScale());
		this.scales.set("keasLowScale", this.initKeasLowScale());
		this.scales.set("speedHigh", this.initSpeedHigh());
		this.scales.set("speedLow", this.initSpeedLow());
	}
}