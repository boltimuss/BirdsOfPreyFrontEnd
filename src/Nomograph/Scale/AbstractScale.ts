import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Section } from "../Section";
import { ShadedRegion } from "../ShadedRegion";
import { Scale } from "./Scale";
import { ScaleLabel } from "./ScaleLabel";
import { Rectangle2D } from "../SupportObjects/Rectangle2D"
import { GraphicsContext } from "../SupportObjects/GraphicsContext";

export abstract class AbstractScale implements Scale
{
    mmPerPixel: number;
    sections: Array<Section>;
    mmHeight: number;
    mmWidth: number;
    mmStartOffset: number;
    charactistics: NomographCharacteristics;
    scaleOffset: Point2D;
    shadedRegions: Array<ShadedRegion>;
    showDraggable: boolean = false;
    label: ScaleLabel;
    value: number = 0.0;
    isDragging: boolean;
    clickZone: Rectangle2D;
    draggableOffset: Point2D = new Point2D(0, 0);
    mouseSceneOffset:Point2D = new Point2D(0, 0);
    draggableX: number = -9999999;
    draggableY: number = -9999999;

    constructor()
    {
        this.mmPerPixel = (window.devicePixelRatio * 96)/25.4;
    }

    isShowDraggable(): boolean {
        return this.showDraggable;
    }

    public init(): void
	{
		this.mmPerPixel = (window.devicePixelRatio * 96)/25.4;
		let offsetX: number = this.mmPerPixel * this.scaleOffset.x;
		let offsetY: number = this.mmPerPixel * this.scaleOffset.y;
		
		let currentPixelLocation: number = (!this.charactistics.isHorizontal) ? offsetY + (this.mmStartOffset*this.mmPerPixel) : offsetX + (this.mmStartOffset*this.mmPerPixel)
		this.sections.forEach((section) =>
		{
			section.startLocation = currentPixelLocation;
			section.endLocation = currentPixelLocation + (((section.mmHeight) ? section.mmHeight : section.mmWidth) * this.mmPerPixel);
			currentPixelLocation +=  (((section.mmHeight) ? section.mmHeight : section.mmWidth) * this.mmPerPixel);
		});
	}

    public containsClick(x: number, y: number): boolean
	{
		let result: boolean = true;
		result = result && (x >= this.clickZone.getMinX() && x <= this.clickZone.getMaxX());
		result = result && (y >= this.clickZone.getMinY() && y <= this.clickZone.getMaxY());
		
		return result;
	}

    public drawMainAxisSpine(offsetX: number, offsetY: number, gc: GraphicsContext, isVertical: boolean): void
    {
        gc.setFill(this.charactistics.color);
		gc.setLineWidth(this.charactistics.lineWidth);

		if (isVertical) 
		{
			gc.strokeLine(offsetX, offsetY, offsetX, offsetY + (this.mmHeight*this.mmPerPixel));
		}
		else{
			gc.strokeLine(offsetX, offsetY, offsetX + (this.mmWidth*this.mmPerPixel), offsetY);
		}
    }

    public drawShadedRegions(offsetX: number, offsetY: number, gc: GraphicsContext): void
    {
        if (this.shadedRegions != null) 
        {
            this.shadedRegions.forEach((region) =>
		    {
				if (!region.useYValue)
				{
					let regionXOffset: number = (offsetX - region.width) * this.mmPerPixel;
					let height: number = Math.abs(this.getPointForSlideValue(region.startValue).y - this.getPointForSlideValue(region.endValue).y);
					gc.setFill(region.color);
					gc.fillRect(regionXOffset, this.getPointForSlideValue(region.startValue).y, region.width* this.mmPerPixel, height);
				}
				else
				{
					gc.setFill(region.color);
					gc.fillRect(offsetX - region.width * this.mmPerPixel, offsetY + (region.yMMStart * this.mmPerPixel), region.width * this.mmPerPixel, (region.yMMEnd - region.yMMStart) * this.mmPerPixel);
				}
			});
		}
    }

	public isDraggingDot(x: number, y: number, scaleMargin: number, isVertical: boolean): boolean
	{
		let result: boolean = true;
		let dragX: number = this.draggableX;
		let dragY: number = this.draggableY;
		
		if (isVertical) 
		{
			result = result && ((x - (this.mmPerPixel * scaleMargin)) <= (dragX + 12) && (x - (this.mmPerPixel * scaleMargin)) >= (dragX - 12));
			result = result && (y <= dragY + 12 && y >= dragY - 12);
		}
		else
		{
			result = result && ((x - (this.mmPerPixel * scaleMargin)) <= dragX + 12 && (x - (this.mmPerPixel * scaleMargin)) >= dragX - 12);
			result = result && (y <= dragY + 12 && y >= dragY - 12);
		}
		
		return result;
	}

    draw(gc: GraphicsContext): void {
        throw new Error("Method not implemented.");
    }

    drawDraggableNotch(gc: GraphicsContext): void {
        throw new Error("Method not implemented.");
    }

	public getDataPointForSlideValue(slideValue: number): number
	{
		for (let i=0; i < this.sections.length; i++)
		{
			let section: Section = this.sections[i];

			if (slideValue >= section.startLocation && slideValue <= section.endLocation)
			{
				let deltaY: number = Math.abs(section.startLocation - section.endLocation);
				let deltaValue: number = Math.abs(section.startValue - section.endValue);
				let percentage: number = Math.abs(slideValue - section.startLocation) / deltaY;

				if (this.charactistics.isDescending)
				{
					return section.startValue - (percentage * deltaValue);
				}
				else
				{
					return (percentage * deltaValue) + section.startValue;
				}
			}
		};
		
		if (slideValue < this.sections[0].startLocation)
		{
			return this.sections[0].startValue;
		}
		else if (slideValue > this.sections[this.sections.length - 1].endLocation)
			{
			return this.sections[this.sections.length - 1].endValue;
		}

		return -999;
	}

	public getSlideValueForPoint(y: number): number
	{
        throw new Error("Method not implemented.");
    }

    getPointForSlideValue(slideValue: number): Point2D {
        throw new Error("Method not implemented.");
    }

}