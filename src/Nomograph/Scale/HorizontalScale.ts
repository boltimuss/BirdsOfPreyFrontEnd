import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Rectangle2D } from "../SupportObjects/Rectangle2D";
import { Section } from "../Section";
import { ShadedRegion } from "../ShadedRegion";
import { AbstractScale } from "./AbstractScale";
import { ScaleLabel } from "./ScaleLabel";
import { GraphicsContext } from "../SupportObjects/GraphicsContext";
import { LabelSide } from "../LabelSide";

export class HorizontalScale extends AbstractScale 
{
	public static builder(): HorizontalScale
	{
		return new HorizontalScale();
	}

	public setMMStartOffset(mmStartOffset: number): HorizontalScale
	{
		this.mmStartOffset = mmStartOffset;
		return this;

	}

	public setMMWidth(mmWidth: number): HorizontalScale
	{
		this.mmWidth = mmWidth;
		return this;

	}

	public setSections(sections: Array<Section>): HorizontalScale
	{
		this.sections = sections;
		return this;

	}

	public setCharactistics(charactistics: NomographCharacteristics): HorizontalScale
	{
		this.charactistics = charactistics;
		return this;

	}

	public setScaleOffset(scaleOffset: Point2D): HorizontalScale
	{
		this.scaleOffset = scaleOffset;
		return this;

	}

	public setDraggableOffset(draggableOffset: Point2D): HorizontalScale
	{
		this.draggableOffset = draggableOffset;
		return this;

	}

	public setClickZone(clickZone: Rectangle2D): HorizontalScale
	{
		this.clickZone = clickZone;
		return this;

	}

	public setLabel(label: ScaleLabel): HorizontalScale
	{
		this.label = label;
		return this;

	}

	public setShadedRegions(shadedRegions: ShadedRegion[]): HorizontalScale
	{
		this.shadedRegions = shadedRegions;
		return this;

	}

	containsClick(x: number, y: number): boolean
	{
		let result: boolean = true;
		result = result && (x >= this.clickZone.getMinX() && x <= this.clickZone.getMaxX());
		result = result && (y >= this.clickZone.getMinY() && y <= this.clickZone.getMaxY());
		
		return result;
	}
		
	public isDraggingDot(x: number, y: number, scaleMargin: number): boolean
	{
		let result: boolean = true;
		let dragX: number = this.draggableX;
		let dragY: number = this.draggableY;
		
		result = result && ((x - (this.mmPerPixel * scaleMargin)) <= dragX + 12 && (x - (this.mmPerPixel * scaleMargin)) >= dragX - 12);
		result = result && (y <= dragY + 12 && y >= dragY - 12);
		
		return result;
	}
	
	public getPointForSlideValue(dataPoint: number): Point2D
	{
		for (let i=0; i < this.sections.length; i++)
		{
			let section: Section = this.sections[i];
			if ((this.charactistics.isDescending && dataPoint <= section.startValue && dataPoint >= section.endValue) ||
				(!this.charactistics.isDescending && dataPoint >= section.startValue && dataPoint <= section.endValue))
			{
				let deltaX: number = Math.abs(section.startLocation - section.endLocation);
				let deltaValue: number = Math.abs(section.startValue - section.endValue);
				let percentage: number = 1 - (Math.abs(dataPoint - section.endValue) / deltaValue);
			    let p: Point2D = new Point2D((section.startLocation+ (deltaX * percentage)), this.scaleOffset.y * this.mmPerPixel);
				return p;
			}
		};
		
		return new Point2D(0,0);
	}
	
	public getDataPointForSlideValue(yValue: number): number
	{
		for (let i=0; i < this.sections.length; i++)
		{
			let section: Section = this.sections[i];
			if (yValue >= section.startLocation && yValue <= section.endLocation)
			{
				let deltaY: number = Math.abs(section.startLocation - section.endLocation);
				let deltaValue: number = Math.abs(section.startValue - section.endValue);
				
				let percentage: number = Math.abs(yValue - section.startLocation) / deltaY;
				if (this.charactistics.isDescending)
				{
					return section.startValue - (percentage * deltaValue);
				}
				else
				{
					return (percentage * deltaValue) + section.startValue;
				}
			}
		}

		return -999;
	}
	
	public init(): void
	{
		this.mmPerPixel = (window.devicePixelRatio * 96)/25.4;
		let offsetY: number = this.mmPerPixel * this.scaleOffset.y;
		
		let currentPixelLocation: number = offsetY + (this.mmStartOffset*this.mmPerPixel);
		this.sections.forEach((section) =>
		{
			section.startLocation = currentPixelLocation;
			section.endLocation = currentPixelLocation + (section.mmHeight * this.mmPerPixel);
			currentPixelLocation += (section.mmHeight * this.mmPerPixel);
		});
	}
	
	public draw(gc: GraphicsContext): void
	{
		let offsetX: number = this.mmPerPixel * this.scaleOffset.x;
		let offsetY: number = this.mmPerPixel * this.scaleOffset.y;
		
		// draw shaded regions first
		if (this.shadedRegions != null) {
            this.shadedRegions.forEach((region) =>
		    {
				if (!region.useYValue)
				{
					let regionXOffset: number = (offsetX - region.width) * this.mmPerPixel;
					let height: number = Math.abs(this.getPointForSlideValue(region.startValue).y - this.getPointForSlideValue(region.endValue).y);
					gc.setFill(region.color);
					gc.fillRect(regionXOffset, this.getPointForSlideValue(region.startValue).y, region.width * this.mmPerPixel, height);
				}
				else
				{
					gc.setFill(region.color);
					gc.fillRect(offsetX - region.width * this.mmPerPixel, offsetY + (region.yMMStart* this.mmPerPixel), region.width * this.mmPerPixel, (region.yMMEnd - region.yMMStart) * this.mmPerPixel);
				}
			})
		}
		
		// draw main axis spine
		gc.setFill(this.charactistics.color);
		gc.setLineWidth(this.charactistics.lineWidth);
		gc.strokeLine(offsetX, offsetY, offsetX + (this.mmWidth*this.mmPerPixel), offsetY);
		
		// draw the section
		gc.moveTo(offsetX + (this.mmPerPixel*this.mmStartOffset), offsetY);
		let startPixel: number = offsetX + (this.mmStartOffset*this.mmPerPixel);
		let currentPixelLocation: number = startPixel;
		
		this.sections.forEach((section) =>
		{
			let deltaValue = Math.abs(section.startValue - section.endValue) / (section.numDivisions - 1);
			let deltaPixel = (section.mmWidth * this.mmPerPixel) / (section.numDivisions - 1);
			let startValue = section.startValue;
			let lastIndex = section.numDivisions - 1;
			section.setStartLocation(currentPixelLocation);
			section.setEndLocation(currentPixelLocation + (section.mmWidth * this.mmPerPixel));
			currentPixelLocation += (section.mmWidth * this.mmPerPixel);
		
			for (let i = 0; i < section.numDivisions; i++)
			{
				gc.font(this.charactistics.fontSize + 'px Arial');
				gc.setFill((this.charactistics.color != null) ? section.color : "black");
				if (this.charactistics.labelSide== LabelSide.RIGHT && ((i == lastIndex && section.drawLast) || i != lastIndex))
				{
					gc.save();
					let offset: number = (i == lastIndex) ? section.fontAxisOffsetLast : section.fontAxisOffset;
					gc.translate(startPixel + (this.charactistics.fontHeightOffset * this.mmPerPixel), offsetY - (offset * this.mmPerPixel));
					gc.rotate(this.charactistics.rotation);
					gc.fillText(""+startValue, this.charactistics.rotationOffset.x, this.charactistics.rotationOffset.y);
					gc.restore();
					gc.strokeLine(startPixel, offsetY - (this.charactistics.tickWidthHeight * this.mmPerPixel), startPixel, offsetY);
				}
				else if ((i == lastIndex && section.drawLast) || i != lastIndex)
				{
					gc.save();
					let offset: number = (i == lastIndex) ? section.fontAxisOffsetLast : section.fontAxisOffset;
					gc.translate(startPixel + (this.charactistics.fontHeightOffset * this.mmPerPixel), offsetY + (offset * this.mmPerPixel));
					gc.rotate(this.charactistics.rotation);
					gc.fillText(""+startValue, this.charactistics.rotationOffset.x, this.charactistics.rotationOffset.y);
					gc.restore();
					gc.strokeLine(startPixel, offsetY + (this.charactistics.tickWidthHeight * this.mmPerPixel), startPixel, offsetY);
				}
				
				startValue += ((this.charactistics.isDescending) ? -deltaValue: deltaValue);
				startPixel += deltaPixel;
			}
		
			startPixel -= deltaPixel;
		})
		
		if (this.label != null)
		{
			let posOffsetX = (this.label.scaleOffset == null) ? 0 : this.label.scaleOffset.x;
			let posOffsetY = (this.label.scaleOffset == null) ? 0 : this.label.scaleOffset.y;
					
			gc.save();
			gc.translate(offsetX + this.label.scaleLocation.x + posOffsetX, offsetY + this.label.scaleLocation.y + posOffsetY);
			gc.rotate(this.label.rotation);
			
			gc.setFill("black");
            gc.font('bold 14px Arial');
			gc.fillText(this.label.label, 0, 0);
			
			gc.restore();
			
			if (this.label.drawValue)
			{
				
				gc.save();
				gc.setFill(this.label.labelColor);
				gc.fillOval(posOffsetX + offsetX + this.label.stepNumLocation.x-2, posOffsetY + offsetY + this.label.stepNumLocation.y, 16, 16);
				
				gc.setFill(this.label.labelColor);
				gc.fillOval(posOffsetX + offsetX + this.label.stepNumLocation.x + 24, posOffsetY + offsetY + this.label.stepNumLocation.y, 16, 16);
				gc.setFill("white");
				gc.fillOval(posOffsetX + offsetX + this.label.stepNumLocation.x + 25, posOffsetY + offsetY + this.label.stepNumLocation.y + 1, 14, 14);
				
				gc.setFill(this.label.labelColor);
				gc.fillRect(posOffsetX + offsetX + this.label.stepNumLocation.x + 8, posOffsetY + offsetY + this.label.stepNumLocation.y, 24, 16);
				gc.setFill("white");
				gc.fillRect(posOffsetX + offsetX + this.label.stepNumLocation.x + 9, posOffsetY + offsetY + this.label.stepNumLocation.y + 1, 24, 14);
				
				gc.setFill("white");
				gc.font("10px Sans");
				gc.fillText(this.label.stepNum, posOffsetX + offsetX +this. label.stepNumLocation.x + 1, posOffsetY + offsetY + this.label.stepNumLocation.y + 11);
				gc.translate(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y);
				gc.restore();
				
				gc.setFill("black");
				gc.font("bold 13px Sans");
				gc.fillText((Math.ceil(this.value * 100) / 100).toFixed(2), posOffsetX + offsetX + this.label.stepNumLocation.x + 10, posOffsetY + offsetY + this.label.stepNumLocation.y + 11);
			}
			else 
			{
				gc.save();
				gc.setFill(this.label.labelColor);
				gc.fillOval(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y, 11, 11);
				gc.setFill("white");
					gc.font("14px Sans Bold");
				gc.fillText(this.label.stepNum, offsetX +this.label.stepNumLocation.x - 7, offsetY + this.label.stepNumLocation.y + 5);
				gc.translate(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y);
				gc.restore();
			}
		}
	}
	
	public drawDraggableNotch(gc: GraphicsContext): void
	{
		// show the draggable notch
		let offsetX: number = this.mmPerPixel * this.scaleOffset.x;
		let offsetY: number = this.mmPerPixel * this.scaleOffset.y;
		if (this.draggableX == -99) this.draggableX = offsetX + (this.mmPerPixel*this.mmStartOffset) + (this.mmPerPixel * this.draggableOffset.x);
		if (this.draggableY == -99) this.draggableY = offsetY;
		
		if (this.showDraggable)
		{
			gc.setFill("red");
			gc.fillOval(this.draggableX - 3, this.draggableY - 3, 6, 6);
			
			// draw the value
			let xOffset: number = (this.charactistics.labelSide == (LabelSide.RIGHT)) ? 0 : -40;
			
			gc.setFill("black");
			gc.setLineWidth(2);
			gc.fillRect(this.draggableX + 5 + xOffset, this.draggableY - 6, 30, 12);
			gc.setFill("white");
			gc.fillRect(this.draggableX + 6 + xOffset, this.draggableY - 5, 28, 10);
			
			gc.setFill("black");
			gc.font("10px Sans");
			
			let value: number = this.getDataPointForSlideValue(this.draggableX);
			if (value > -999)
			{
				gc.fillText((Math.ceil(this.value * 100) / 100).toFixed(2), this.draggableX + 8 + xOffset, this.draggableY + 3);
			}
		}
	}
}
