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
		this.charactistics.isHorizontal = true;
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
	
public getDataPointForSlideValue(slideValue: number): number
	{
		for (let i=0; i < this.sections.length; i++)
		{
			let section: Section = this.sections[i];

			if (slideValue >= section.startLocation && slideValue <= section.endLocation)
			{
				let deltaX: number = Math.abs(section.startLocation - section.endLocation);
				let deltaValue: number = Math.abs(section.startValue - section.endValue);
				let percentage: number = Math.abs(slideValue - section.startLocation) / deltaX;

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
			    let p: Point2D = new Point2D( section.startLocation+ (deltaX * percentage), this.scaleOffset.y * this.mmPerPixel);
				return p;
			}
		};
		
		return new Point2D(0,0);
	}
	
	public draw(gc: GraphicsContext): void
	{
		let offsetX: number = this.mmPerPixel * this.scaleOffset.x;
		let offsetY: number = this.mmPerPixel * this.scaleOffset.y;
		
		// draw shaded regions first
		this.drawShadedRegions(offsetX, offsetY, gc);
		
		// draw main axis spine
		this.drawMainAxisSpine(offsetX, offsetY, gc, false);
		
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
				
				gc.setFill(this.label.stepNumColor);
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
				gc.setFill(this.label.stepNumColor);
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
		if (this.draggableX == -9999999) this.draggableX = offsetX;
		if (this.draggableY == -9999999) this.draggableY = offsetY;
		
		if (this.showDraggable)
		{
			gc.setFill("red");
			gc.fillOval(this.draggableX , this.draggableY, 6, 6);
			
			// draw the value
			let xOffset:number = (this.charactistics.labelSide == (LabelSide.RIGHT)) ? 26 : -40;
			
			gc.setFill("black");
			gc.setLineWidth(2);
			gc.fillRect(this.draggableX - 18 + xOffset, this.draggableY - 9, 50, 16);
			gc.setFill("white");
			gc.fillRect(this.draggableX - 17 + xOffset, this.draggableY - 8, 48, 14);
			
			gc.setFill("black");
			gc.font("normal 13px Sans");
			
			this.value = this.getDataPointForSlideValue(this.draggableX);
			if (this.value > -999)
			{
				gc.fillText((Math.ceil(this.value * 100) / 100).toFixed(2), this.draggableX -9 + xOffset, this.draggableY + 3);
			}

			else 
				gc.fillText("-999.99", this.draggableX - 9 + xOffset, this.draggableY + 3);
		}
	}
}
