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

export class Chart2 extends Chart
{

	isDragging: boolean = false;
	dragOffset: number = 0;
	mouseStart: Point2D;
	noClick: boolean = false;

    public drawLines(): void 
    {
		this.draw(1.0);
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (altitudeScale !== undefined && altitudeScale.isShowDraggable() && 
		    keasLowScale !== undefined && keasLowScale.isShowDraggable())
		{
			let x1: number = altitudeScale.draggableX;
			let y1: number = altitudeScale.draggableY;
			let x2: number = keasLowScale.draggableX;
			let y2: number = keasLowScale.draggableY;
			let slope = (y2 - y1) / (x2 - x1);
			let x3: number = 76 * this.mmPerPixel;
			let y3: number = (slope * (x3 - x2)) + y2;
			
			this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x3, y3);
		}
		else if (altitudeScale !== undefined && altitudeScale.isShowDraggable() && 
		            keasHighScale !== undefined && keasHighScale.isShowDraggable())
		{
			let x1: number = altitudeScale.draggableX;
			let y1: number = altitudeScale.draggableY;
			let x2: number = keasHighScale.draggableX;
			let y2: number = keasHighScale.draggableY;
			let slope = (y2 - y1) / (x2 - x1);
			let x3: number = 76 * this.mmPerPixel;
			let y3: number = (slope * (x3 - x2)) + y2;

            this.ctx.setLineWidth(1);
			this.ctx.strokeLine(x1, y1, x3, y3);
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
			GameState.getInstanceOf().aircraftState.get(currentAircraftId).setKeas(value);
			return value;
		}
		else if (altitudeScale !== undefined && speedLow !== undefined)
		{
			let value: number = this.getKeasLow(altitudeScale.getPointForSlideValue(altitude).y, speedLow.getPointForSlideValue(speedLowValue).y);
			let currentAircraftId: string  = GameState.getInstanceOf().currentAircraft;
			GameState.getInstanceOf().aircraftState.get(currentAircraftId).setKeas(value);
			return value;
		}
	}
	
	private initAltitudeScale(): VerticalScale
	{
		let sections: Array<Section> = [];
		
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(31.5).setNumDivisions(13).setStartValue(320).setEndValue(200).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(20).setNumDivisions(9).setStartValue(200).setEndValue(120).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(2.25).setNumDivisions(2).setStartValue(120).setEndValue(110).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(4.5).setNumDivisions(3).setStartValue(110).setEndValue(90).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.5).setNumDivisions(3).setStartValue(90).setEndValue(70).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.25).setNumDivisions(3).setStartValue(70).setEndValue(50).setDrawLast(false));
		sections.push(Section.builder().setFontAxisOffset(7).setFontAxisOffsetLast(6).setMMHeight(10).setNumDivisions(6).setStartValue(50).setEndValue(0).setDrawLast(true));
				
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(true).setColor("black").setLabelSide(LabelSide.LEFT);
		
		let altitudeScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(10)
				.setMMHeight(87)
				.setSections(sections) 
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(10, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D(this.scaleMargin * this.mmPerPixel, 10 * this.mmPerPixel, 35, 212 * this.mmPerPixel));

		altitudeScale.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("Altitude")
				.setLabelColor("rgb(255, 15, 0)")
				.setStepNum(" 2")
				.setScaleLocation(new Point2D(6, -8))
				.setStepNumLocation(new Point2D(2, -25)));
		
		altitudeScale.init();
		
		return altitudeScale;
	}
	
	private initKeasHighScale(): VerticalScale
	{
		let sections: Array<Section> = [];
		
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(15.5).setNumDivisions(3).setStartValue(160).setEndValue(240));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(11).setNumDivisions(3).setStartValue(240).setEndValue(320));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(8.5).setNumDivisions(3).setStartValue(320).setEndValue(400));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(7).setNumDivisions(3).setStartValue(400).setEndValue(480));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(5.75).setNumDivisions(3).setStartValue(480).setEndValue(560));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(5).setNumDivisions(3).setStartValue(560).setEndValue(640));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(4.5).setNumDivisions(3).setStartValue(640).setEndValue(720));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(4).setNumDivisions(3).setStartValue(720).setEndValue(800));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(3.5).setNumDivisions(3).setStartValue(800).setEndValue(880));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(3.5).setNumDivisions(3).setStartValue(880).setEndValue(960));
		sections.push(Section.builder().setFontAxisOffsetLast(2).setDrawLast(true).setFontAxisOffset(2).setMMHeight(1.5).setNumDivisions(2).setStartValue(960).setEndValue(1000));
		
		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("purple").setLabelSide(LabelSide.RIGHT);
		
		let keasHighScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(69.5)
				.setSections(sections) 
				.setCharactistics(characteristics)
				.setDraggableOffset(new Point2D(0, 0))
				.setScaleOffset(new Point2D(29, 10))
				.setClickZone(new Rectangle2D((this.scaleMargin + 30) * this.mmPerPixel, 8 * this.mmPerPixel, 28, 75 * this.mmPerPixel));

		keasHighScale.init();
		
		return keasHighScale;
	}
	
	private initKeasLowScale(): VerticalScale
	{
		let sections: Array<Section> = [];

		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(15.5).setNumDivisions(2).setStartValue(80).setEndValue(120));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(11).setNumDivisions(2).setStartValue(120).setEndValue(160));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(8.5).setNumDivisions(2).setStartValue(160).setEndValue(200));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(7).setNumDivisions(2).setStartValue(200).setEndValue(240));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(5.75).setNumDivisions(2).setStartValue(240).setEndValue(280));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(5).setNumDivisions(2).setStartValue(280).setEndValue(320));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.5).setNumDivisions(2).setStartValue(320).setEndValue(360));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4).setNumDivisions(2).setStartValue(360).setEndValue(400));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(3.5).setNumDivisions(2).setStartValue(400).setEndValue(440));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(3.5).setNumDivisions(2).setStartValue(440).setEndValue(480));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(3).setNumDivisions(2).setStartValue(480).setEndValue(520));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(3).setNumDivisions(2).setStartValue(520).setEndValue(560));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(2.5).setNumDivisions(2).setStartValue(560).setEndValue(600));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.75).setNumDivisions(2).setStartValue(600).setEndValue(680));
		sections.push(Section.builder().setFontAxisOffset(7).setMMHeight(4.25).setNumDivisions(2).setStartValue(680).setEndValue(760));
		sections.push(Section.builder().setFontAxisOffsetLast(7).setDrawLast(true).setFontAxisOffset(7).setMMHeight(2.75).setNumDivisions(2).setStartValue(760).setEndValue(800));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("black").setLabelSide(LabelSide.LEFT);
		
		let keasLowScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(88.5)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(29, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D((this.scaleMargin + 22) * this.mmPerPixel, 8 * this.mmPerPixel, 21, 92 * this.mmPerPixel));
		
		keasLowScale.setLabel(ScaleLabel.builder()
				.setDrawValue(false)
				.setLabel("KEAS")
				.setLabelColor("rgb(255, 15, 0)")
				.setStepNum(" 2")
				.setScaleLocation(new Point2D(26, -6))
				.setScaleOffset(new Point2D(10, 0))
				.setStepNumLocation(new Point2D(2, -25)));
		
		keasLowScale.init();
		
		return keasLowScale;
	}
	
	private initMachHigh(): VerticalScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(10).setNumDivisions(2).setStartValue(1.2).setEndValue(1.3));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(9.25).setNumDivisions(2).setStartValue(1.3).setEndValue(1.4));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(8.75).setNumDivisions(2).setStartValue(1.4).setEndValue(1.5));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(8.25).setNumDivisions(2).setStartValue(1.5).setEndValue(1.6));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(7.75).setNumDivisions(2).setStartValue(1.6).setEndValue(1.7));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(7.25).setNumDivisions(2).setStartValue(1.7).setEndValue(1.8));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(6.75).setNumDivisions(2).setStartValue(1.8).setEndValue(1.9));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(6.5).setNumDivisions(2).setStartValue(1.9).setEndValue(2.0));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(6.25).setNumDivisions(2).setStartValue(2.0).setEndValue(2.1));
		sections.push(Section.builder().setFontAxisOffset(2).setMMHeight(5.75).setNumDivisions(2).setStartValue(2.1).setEndValue(2.2));
		sections.push(Section.builder().setFontAxisOffsetLast(2).setDrawLast(true).setFontAxisOffset(2).setMMHeight(5.5).setNumDivisions(2).setStartValue(2.2).setEndValue(2.3));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("black").setLabelSide(LabelSide.RIGHT);
		
		let machHighScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(87)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(76, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setClickZone(new Rectangle2D((76 + this.scaleMargin) * this.mmPerPixel, 8 * this.mmPerPixel, 21, 212 * this.mmPerPixel));
		
		machHighScale.init();
		
		return machHighScale;
	}
	
	private initMachLow(): VerticalScale
	{
		let sections: Array<Section> = [];
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(10).setNumDivisions(2).setStartValue(.6).setEndValue(.65));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(9.25).setNumDivisions(2).setStartValue(.65).setEndValue(.7));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(8.75).setNumDivisions(2).setStartValue(.7).setEndValue(.75));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(8.25).setNumDivisions(2).setStartValue(.75).setEndValue(.8));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(7.75).setNumDivisions(2).setStartValue(.8).setEndValue(.85));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(7.25).setNumDivisions(2).setStartValue(.85).setEndValue(.9));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(6.75).setNumDivisions(2).setStartValue(.9).setEndValue(.95));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(6.5).setNumDivisions(2).setStartValue(.95).setEndValue(1.0));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(6.25).setNumDivisions(2).setStartValue(1.0).setEndValue(1.05));
		sections.push(Section.builder().setFontAxisOffset(8).setMMHeight(5.75).setNumDivisions(2).setStartValue(1.05).setEndValue(1.1));
		sections.push(Section.builder().setFontAxisOffsetLast(8).setDrawLast(true).setFontAxisOffset(8).setMMHeight(5.5).setNumDivisions(2).setStartValue(1.10).setEndValue(1.15));

		let shadedRegions: Array<ShadedRegion> = [];
		shadedRegions.push(ShadedRegion.builder().setColor("grey").setWidth(1.5).setStartValue(.6).setEndValue(.90).setUseYValue(true).setyMMStart(0).setyMMEnd(51.25));
		shadedRegions.push(ShadedRegion.builder().setColor("yellow").setWidth(1.5).setStartValue(.9).setEndValue(1.0).setUseYValue(true).setyMMStart(51.25).setyMMEnd(64.5));
		shadedRegions.push(ShadedRegion.builder().setColor("orangered").setWidth(1.0).setStartValue(1.0).setEndValue(1.10).setUseYValue(true).setyMMStart(64.5).setyMMEnd(76.5));

		let characteristics: NomographCharacteristics = NomographCharacteristics.builder()
				.setFontSize(11).setTickWidthHeight(1).setFontHeightOffset(.75).setLineWidth(1).setIsDescending(false).setColor("black").setLabelSide(LabelSide.LEFT);
		
		let machLowScale: VerticalScale = VerticalScale.builder()
				.setMMStartOffset(0)
				.setMMHeight(87)
				.setSections(sections)
				.setCharactistics(characteristics)
				.setScaleOffset(new Point2D(76, 10))
				.setDraggableOffset(new Point2D(0,0))
				.setShadedRegions(shadedRegions)
				.setClickZone(new Rectangle2D((69 + this.scaleMargin) * this.mmPerPixel, 8 * this.mmPerPixel, 21, 212 * this.mmPerPixel))
		
		machLowScale.setLabel(ScaleLabel.builder()
				.setDrawValue(true)
				.setLabel("Mach")
				.setLabelColor("rgb(255,15,0)")
				.setStepNum(" 2")
				.setScaleLocation(new Point2D(-35, -6))
				.setScaleOffset(new Point2D(-10, 0))
				.setStepNumLocation(new Point2D(-40, -25)));
		
		machLowScale.init();
		
		return machLowScale;
	}

	public handleMouseMove(x: number, y: number)
	{
		if (!this.isDragging) {
			return;
		}

		this.noClick = true;
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");
		let machLow: AbstractScale | undefined = this.scales.get("machLow");

		if (altitudeScale && !altitudeScale.isDragging && altitudeScale.isDraggingDot(x, y, this.scaleMargin))
		{
			altitudeScale.isDragging = true;
			if (keasHighScale) keasHighScale.isDragging = false;
			if (keasLowScale) keasLowScale.isDragging = false;
		}
		else if (keasLowScale && !keasLowScale.isDragging && keasLowScale.isDraggingDot(x, y, this.scaleMargin))
		{
			keasLowScale.isDragging = true;
			if (keasHighScale) keasHighScale.isDragging = false;
			if (altitudeScale) altitudeScale.isDragging = false;
		}
		else if (keasHighScale && !keasHighScale.isDragging && keasHighScale.isDraggingDot(x, y, this.scaleMargin))
		{
			keasHighScale.isDragging = true;
			if (keasLowScale) keasLowScale.isDragging = false;
			if (altitudeScale) altitudeScale.isDragging = false;
		}
		
		if (altitudeScale && altitudeScale.isShowDraggable() && altitudeScale.isDragging && keasLowScale && keasHighScale) 
		{
			let offsetY = this.mmPerPixel *altitudeScale.scaleOffset.y;
			if (y < offsetY + (this.mmPerPixel*altitudeScale.mmStartOffset)) return;
			else if (y > offsetY + (altitudeScale.mmHeight*this.mmPerPixel)) return;
			let clampResult: number = this.clampToscale(altitudeScale.draggableX, y, 
					keasLowScale.draggableX, keasLowScale.draggableY, 
					keasHighScale.draggableX, keasHighScale.draggableY);
			if (clampResult == 0)
			{
				altitudeScale.draggableY = y;
			}
			else
			{
				altitudeScale.draggableY = this.calcAltitudeYForMachY((clampResult == -1),keasLowScale.isShowDraggable());
			}
			
			if (keasLowScale.isShowDraggable() && machLow)
			{
				machLow.value = this.getLowMach(altitudeScale.draggableY, keasLowScale.draggableY);
				// String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
				// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setMach(getScales().get("machLow").getValue());
			}
			else if (keasHighScale.isShowDraggable() && machLow)
			{
				machLow.value = this.getHighMach(altitudeScale.draggableY, keasHighScale.draggableY);
				// String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
				// GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setMach(getScales().get("machLow").getValue());
			}
		}
		// else if (keasLowScale && keasLowScale.isShowDraggable() && keasLowScale.isDragging) 
		// {
		// 	double offsetY = mmPerPixel * getScales().get("keasLowScale").getScaleOffset().getY();
		// 	if ((sceneY/2.0) < offsetY + (mmPerPixel*getScales().get("keasLowScale").getMmStartOffset())) return;
		// 	else if ((sceneY/2.0) > offsetY + (getScales().get("keasLowScale").getMmHeight()*mmPerPixel)) return;
		// 	int clampResult = clampToscale(getScales().get("altitudeScale").getDraggableX(), getScales().get("altitudeScale").getDraggableY(), 
		// 			getScales().get("keasLowScale").getDraggableX(), sceneY/2.0, 
		// 			getScales().get("keasHighScale").getDraggableX(), getScales().get("keasHighScale").getDraggableY());
		// 	if (clampResult == 0)
		// 	{
		// 		getScales().get("keasLowScale").setDraggableY(sceneY/2.0);
		// 	}
		// 	else
		// 	{
		// 		getScales().get("keasLowScale").setDraggableY(calcLowKeasYForMachY((clampResult == -1), true));
		// 	}
		// 	getScales().get("machLow").setValue(getLowMach(getScales().get("altitudeScale").getDraggableY(), getScales().get("keasLowScale").getDraggableY()));
		// 	String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
		// 	GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setMach(getScales().get("machLow").getValue());
		// }
		// else if (keasHighScale && keasHighScale.isShowDraggable() && keasHighScale.isDragging)
		// {
		// 	double offsetY = mmPerPixel * getScales().get("keasHighScale").getScaleOffset().getY();
		// 	if ((sceneY/2.0) < offsetY + (mmPerPixel*getScales().get("keasHighScale").getMmStartOffset())) return;
		// 	else if ((sceneY/2.0) > offsetY + (getScales().get("keasHighScale").getMmHeight()*mmPerPixel)) return;
		// 	int clampResult = clampToscale(getScales().get("altitudeScale").getDraggableX(), getScales().get("altitudeScale").getDraggableY(), 
		// 			getScales().get("keasLowScale").getDraggableX(), getScales().get("keasLowScale").getDraggableY(), 
		// 			getScales().get("keasHighScale").getDraggableX(), sceneY/2.0);
		// 	if (clampResult == 0)
		// 	{
		// 		getScales().get("keasHighScale").setDraggableY(sceneY/2.0);
		// 	}
		// 	else
		// 	{
		// 		getScales().get("keasHighScale").setDraggableY(calcLowKeasYForMachY((clampResult == -1), false));
		// 	}
		// 	getScales().get("machLow").setValue(getHighMach(getScales().get("altitudeScale").getDraggableY(), getScales().get("keasHighScale").getDraggableY()));
		// 	String currentAircraftId = GameState.getInstanceOf().getCurrentAircraft();
		// 	GameState.getInstanceOf().getAircraftState().get(currentAircraftId).setMach(getScales().get("machLow").getValue());
		// }
		else
		{
			this.noClick = false;
			return;
		}
		
		this.drawLines();
	}

		private getLowMach(altitudeY: number, speedLowY: number): number
	{
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let machLow: AbstractScale | undefined = this.scales.get("machLow");

		if (!altitudeScale || !keasLowScale || !machLow) return 0.0;
		let altX: number = altitudeScale.scaleOffset.x * this.mmPerPixel;
		let altY: number = altitudeY;
		let speedLowX: number = keasLowScale.scaleOffset.x * this.mmPerPixel;
		let slope: number = (speedLowY - altY) / (speedLowX - altX);
		let machLowX: number = machLow.scaleOffset.x * this.mmPerPixel;
		let machLowinterceptY: number = speedLowY + (slope * (machLowX - speedLowX));
		
		return machLow.getDataPointForSlideValue(machLowinterceptY);
	}
	
	private getHighMach(altitudeY: number, speedHighY: number): number
	{
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");
		let machHigh: AbstractScale | undefined = this.scales.get("machHigh");

		if (!altitudeScale || !keasHighScale || !machHigh) return 0.0;

		let altX: number = altitudeScale.scaleOffset.x * this.mmPerPixel;
		let altY: number = altitudeY;
		let speedHighX: number =keasHighScale.scaleOffset.x * this.mmPerPixel;
		let slope: number = (speedHighY - altY) / (speedHighX - altX);
		let machHighX: number = machHigh.scaleOffset.x * this.mmPerPixel;
		let machHighinterceptY: number = speedHighY + (slope * (machHighX - speedHighX));
		
		return machHigh.getDataPointForSlideValue(machHighinterceptY);
	}

	private calcAltitudeYForMachY(useMin: boolean, useLowMach: boolean): number
	{
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");
		let machLow: AbstractScale | undefined = this.scales.get("machLow");
		let machHigh: AbstractScale | undefined = this.scales.get("machHigh");

		if (!altitudeScale || !keasLowScale || !keasHighScale || !machLow || !machHigh) return 0;

		let x1: number = altitudeScale.scaleOffset.x * this.mmPerPixel;
		let x2: number = (useLowMach) ? keasLowScale.scaleOffset.x * this.mmPerPixel : keasHighScale.scaleOffset.x * this.mmPerPixel;
		let y2: number = (useLowMach) ? keasLowScale.draggableY : keasHighScale.draggableY;
		let x3: number = (useLowMach) ? machLow.scaleOffset.x * this.mmPerPixel : machHigh.scaleOffset.x * this.mmPerPixel;
		let y3: number = (useMin) ? machLow.scaleOffset.y * this.mmPerPixel : 
			(machLow.scaleOffset.y + machLow.mmHeight) * this.mmPerPixel;
		let slope = (y3 - y2) / (x3 - x2);
		return y2 - ((x2 - x1) * slope);
	}

	private clampToscale(altitudeDragX: number, altitudeDragY: number, keasLowDragX: number, keasLowDragY: number, keasHighDragX: number, keasHighDragY: number): number
	{
		let slope: number = 0;
		let bias: number = .1;
		let altitudeScale: AbstractScale | undefined = this.scales.get("altitudeScale");
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");
		let machLow: AbstractScale | undefined = this.scales.get("machLow");
		let machHigh: AbstractScale | undefined = this.scales.get("machHigh");

		if (altitudeScale && altitudeScale.isShowDraggable() && keasLowScale && keasLowScale.isShowDraggable() && machLow)
		{
			let x1: number = altitudeDragX;
			let y1: number = altitudeDragY;
			let x2: number = keasLowDragX;
			let y2: number = keasLowDragY;
			slope = (y2 - y1) / (x2 - x1);
			let x3: number = 76 * this.mmPerPixel;
			let y3: number = (slope * (x3 - x2)) + y2;
			let offsetY: number = this.mmPerPixel * machLow.scaleOffset.y;
			
			if (y3 < offsetY + (this.mmPerPixel*machLow.mmStartOffset - bias))
			{
				return -1;
			}
			else if (y3 > offsetY + (machLow.mmHeight*this.mmPerPixel) + bias)
			{
				return 1;
			}
			
		}
		else if (altitudeScale && altitudeScale.isShowDraggable() && keasHighScale && keasHighScale.isShowDraggable() && machHigh)
		{
			let x1: number = altitudeDragX;
			let y1: number = altitudeDragY;
			let x2: number = keasHighDragX;
			let y2: number = keasHighDragY;
			slope = (y2 - y1) / (x2 - x1);
			let x3: number = 76 * this.mmPerPixel;
			let y3: number = (slope * (x3 - x2)) + y2;
			
			let offsetY = this.mmPerPixel * machHigh.scaleOffset.y;
			
			if (y3 < offsetY + (this.mmPerPixel*machHigh.mmStartOffset) - bias)
			{
				return -1;
			}
			else if (y3 > offsetY + (machHigh.mmHeight*this.mmPerPixel) + bias)
			{
				return 1;
			}
		}
		
		return 0;
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
		let keasLowScale: AbstractScale | undefined = this.scales.get("keasLowScale");
		let keasHighScale: AbstractScale | undefined = this.scales.get("keasHighScale");

		if (altitudeScale && altitudeScale.containsClick(x, y))
		{
			altitudeScale.showDraggable = !altitudeScale.isShowDraggable();
		}
		else if (keasLowScale && keasLowScale.containsClick(x, y) && keasHighScale)
		{
			keasHighScale.showDraggable = false;
			keasLowScale.showDraggable = !keasLowScale.isShowDraggable();
		}
		else if (keasHighScale && keasHighScale.containsClick(x, y) && keasLowScale)
		{
			keasLowScale.showDraggable = false;
			keasHighScale.showDraggable = !keasHighScale.isShowDraggable();
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
		this.scales.set("keasLowScale", this.initKeasLowScale());
		this.scales.set("keasHighScale", this.initKeasHighScale());
		this.scales.set("machLow", this.initMachLow());
		this.scales.set("machHigh", this.initMachHigh());
	}
}