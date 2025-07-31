import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Rectangle2D } from "../SupportObjects/Rectangle2D";
import { Section } from "../Section";
import { ShadedRegion } from "../ShadedRegion";
import { AbstractScale } from "../Scale/AbstractScale";
import { ScaleLabel } from "./ScaleLabel";
import { GraphicsContext } from "../SupportObjects/GraphicsContext";
import { LabelSide } from "../LabelSide";

export class VerticalScale extends AbstractScale 
{
	public static builder(): VerticalScale
	{
		return new VerticalScale();
	}

	public setMMStartOffset(mmStartOffset: number): VerticalScale
	{
		this.mmStartOffset = mmStartOffset;
		return this;

	}

	public setMMHeight(mmHeight: number): VerticalScale
	{
		this.mmHeight = mmHeight;
		return this;

	}

	public setSections(sections: Array<Section>): VerticalScale
	{
		this.sections = sections;
		return this;

	}

	public setCharactistics(charactistics: NomographCharacteristics): VerticalScale
	{
		this.charactistics = charactistics;
		return this;

	}

	public setScaleOffset(scaleOffset: Point2D): VerticalScale
	{
		this.scaleOffset = scaleOffset;
		return this;

	}

	public setDraggableOffset(draggableOffset: Point2D): VerticalScale
	{
		this.draggableOffset = draggableOffset;
		return this;

	}

	public setClickZone(clickZone: Rectangle2D): VerticalScale
	{
		this.clickZone = clickZone;
		return this;

	}

	public setLabel(label: ScaleLabel): VerticalScale
	{
		this.label = label;
		return this;

	}

	public setShadedRegions(shadedRegions: ShadedRegion[]): VerticalScale
	{
		this.shadedRegions = shadedRegions;
		return this;

	}
		
	public getPointForSlideValue(dataPoint: number): Point2D
	{
		this.sections.forEach((section) =>
		{
			if ((this.charactistics.isDescending && dataPoint <= section.startValue && dataPoint >= section.endValue) ||
				(!this.charactistics.isDescending && dataPoint >= section.startValue && dataPoint <= section.endValue))
			{
				let deltaY: number = Math.abs(section.startLocation - section.endLocation);
				let deltaValue: number = Math.abs(section.startValue - section.endValue);
				let percentage: number = 1 - (Math.abs(dataPoint - section.endValue) / deltaValue);
			    let p: Point2D = new Point2D((this.scaleOffset.x * this.mmPerPixel), section.startLocation+ (deltaY * percentage));
				return p;
			}
		});
		
		return new Point2D(0,0);
	}
	
	public draw(gc: GraphicsContext): void
	{
		let offsetX: number = this.mmPerPixel * this.scaleOffset.x;
		let offsetY: number= this.mmPerPixel * this.scaleOffset.y;
		
		// draw shaded regions first
		this.drawShadedRegions(offsetX, offsetY, gc);
		
		// draw main axis spine
		this.drawMainAxisSpine(offsetX, offsetY, gc, true);
		
		// draw the section
		gc.moveTo(offsetX, offsetY + (this.mmPerPixel*this.mmStartOffset));
		let startPixel: number = offsetY + (this.mmStartOffset*this.mmPerPixel);
		let currentPixelLocation: number = offsetY + (this.mmStartOffset*this.mmPerPixel);
		
		this.sections.forEach((section) =>
		{
			let deltaValue: number = Math.abs(section.startValue - section.endValue) / (section.numDivisions - 1);
			let deltaPixel: number = (section.mmHeight * this.mmPerPixel) / (section.numDivisions - 1);
			let startValue: number = section.startValue;
			let lastIndex: number = section.numDivisions - 1;
			currentPixelLocation += (section.mmHeight * this.mmPerPixel);
			
			for (let i = 0; i < section.numDivisions; i++)
			{
                gc.font(this.charactistics.fontSize + 'px Arial');
				gc.setFill((this.charactistics.color != null) ? section.color : "black");
				if ((this.charactistics.labelSide == LabelSide.LEFT) && ((i == lastIndex && section.drawLast) || i != lastIndex))
				{
					let offset: number = (i == lastIndex) ? section.fontAxisOffsetLast : section.fontAxisOffset;
					gc.fillText(""+startValue, offsetX - (offset * this.mmPerPixel), 
							startPixel + (this.charactistics.fontHeightOffset * this.mmPerPixel));
					gc.strokeLine(offsetX - (this.charactistics.tickWidthHeight * this.mmPerPixel), startPixel, offsetX, startPixel);
				}
				else if ((i == lastIndex && section.drawLast) || i != lastIndex)
				{
					let offset: number = (i == lastIndex) ? section.fontAxisOffsetLast : section.fontAxisOffset;
					gc.fillText(""+startValue, offsetX + (offset * this.mmPerPixel), 
							startPixel + (this.charactistics.fontHeightOffset * this.mmPerPixel));
					gc.strokeLine(offsetX + (this.charactistics.tickWidthHeight * this.mmPerPixel), startPixel, offsetX, startPixel);
				}
				
				startValue += ((this.charactistics.isDescending) ? -deltaValue: deltaValue);
				startPixel += deltaPixel;
			}
			
			startPixel -= deltaPixel;
		});
		
		if (this.label != null)
		{
			let posOffsetX: number = (this.label.scaleOffset == null) ? 0 : this.label.scaleOffset.x;
			let posOffsetY: number = (this.label.scaleOffset == null) ? 0 : this.label.scaleOffset.y;
					
			gc.save();
			gc.translate(offsetX + this.label.scaleLocation.x + posOffsetX, offsetY + this.label.scaleLocation.y + posOffsetY);
			gc.rotate(90 + this.label.rotation);
			
			gc.setFill("black");
            gc.font('bold 14px Arial');
			gc.fillText(this.label.label, 0, 0);
			gc.restore();
			
			if (this.label.drawValue)
			{
				gc.save();
				gc.setFill(this.label.labelColor);
				gc.fillOval(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y, 11, 11);
				gc.setFill(this.label.labelColor);
				gc.fillOval(offsetX +  this.label.stepNumLocation.x + 49, posOffsetY + offsetY + this.label.stepNumLocation.y, 12, 11);
				gc.setFill("white");
				gc.fillOval(offsetX +  this.label.stepNumLocation.x + 50, posOffsetY + offsetY + this.label.stepNumLocation.y, 10, 10);
				
				gc.setFill(this.label.labelColor);
				gc.fillRect(offsetX +  this.label.stepNumLocation.x + 2, offsetY +  this.label.stepNumLocation.y - 11, 48, 22);
				gc.setFill("white");
				gc.fillRect(offsetX +  this.label.stepNumLocation.x + 8, offsetY +  this.label.stepNumLocation.y - 10, 43, 20);
				
				gc.setFill(this.label.stepNumColor);
				gc.font("normal 14px Sans");
				gc.fillText(this.label.stepNum,  offsetX + this.label.stepNumLocation.x - 5, offsetY + this.label.stepNumLocation.y + 5);
				gc.restore();
				
				gc.setFill("black");
				gc.font("bold 13px Sans");
				
				gc.fillText((Math.ceil(this.value * 100) / 100).toFixed(2), offsetX + this.label.stepNumLocation.x + 10, posOffsetY + offsetY + this.label.stepNumLocation.y + 5);

			}
			else 
			{
				gc.save();
				gc.setFill(this.label.labelColor);
				gc.fillOval(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y, 11, 11);
				gc.setFill(this.label.stepNumColor);
				gc.font("14px Sans Bold");
				gc.fillText(this.label.stepNum, offsetX + this.label.stepNumLocation.x - 6.5, offsetY + this.label.stepNumLocation.y + 5.5);
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
		if (this.draggableX == -99) this.draggableX = offsetX + (this.mmPerPixel * this.draggableOffset.x);
		if (this.draggableY == -99) this.draggableY = offsetY + (this.mmPerPixel * this.mmStartOffset) + (this.mmPerPixel * this.draggableOffset.y);
		
		if (this.showDraggable)
		{
			gc.setFill("red");
			gc.fillOval(this.draggableX, this.draggableY, 6, 6);
			
			// draw the value
			let xOffset:number = (this.charactistics.labelSide == (LabelSide.RIGHT)) ? 26 : -40;
			
			gc.setFill("black");
			gc.setLineWidth(2);
			gc.fillRect(this.draggableX - 18 + xOffset, this.draggableY - 9, 50, 16);
			gc.setFill("white");
			gc.fillRect(this.draggableX - 17 + xOffset, this.draggableY - 8, 48, 14);
			
			gc.setFill("black");
			gc.font("normal 13px Sans");
			let value: number = this.getDataPointForSlideValue(this.draggableY);
			if (value > -999)
			{
				gc.fillText((Math.ceil(value * 100) / 100).toFixed(2), this.draggableX - 12 + xOffset, this.draggableY + 3);
			}
			
			else 
				gc.fillText("-999.99", this.draggableX - 12 + xOffset, this.draggableY + 3);
		}
	}
}
