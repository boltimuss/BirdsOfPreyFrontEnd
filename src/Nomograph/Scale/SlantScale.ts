import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Rectangle2D } from "../SupportObjects/Rectangle2D";
import { Section } from "../Section";
import { ShadedRegion } from "../ShadedRegion";
import { AbstractScale } from "./AbstractScale";
import { ScaleLabel } from "./ScaleLabel";
import { GraphicsContext } from "../SupportObjects/GraphicsContext";
import { LabelSide } from "../LabelSide";

export class SlantScale extends AbstractScale 
{
	public static builder(): SlantScale
	{
		return new SlantScale();
	}

	public setMMStartOffset(mmStartOffset: number): SlantScale
	{
		this.mmStartOffset = mmStartOffset;
		return this;

	}

	public setMMHeight(mmHeight: number): SlantScale
	{
		this.mmHeight = mmHeight;
		return this;

	}

	public setSections(sections: Array<Section>): SlantScale
	{
		this.sections = sections;
		return this;

	}

	public setCharactistics(charactistics: NomographCharacteristics): SlantScale
	{
		this.charactistics = charactistics;
		return this;

	}

	public setScaleOffset(scaleOffset: Point2D): SlantScale
	{
		this.scaleOffset = scaleOffset;
		return this;

	}

	public setDraggableOffset(draggableOffset: Point2D): SlantScale
	{
		this.draggableOffset = draggableOffset;
		return this;

	}

	public setClickZone(clickZone: Rectangle2D): SlantScale
	{
		this.clickZone = clickZone;
		return this;

	}

	public setLabel(label: ScaleLabel): SlantScale
	{
		this.label = label;
		return this;

	}

	public setShadedRegions(shadedRegions: ShadedRegion[]): SlantScale
	{
		this.shadedRegions = shadedRegions;
		return this;

	}

	public getPointForSlideValue(dataPoint: number): Point2D
	{
		for (let i=0; i < this.sections.length; i++)
		{
			let section: Section = this.sections[i];
			if ((this.charactistics.isDescending && dataPoint <= section.startValue && dataPoint >= section.endValue) ||
				(!this.charactistics.isDescending && dataPoint >= section.startValue && dataPoint <= section.endValue))
			{
				let deltaY: number = Math.abs(section.startLocation - section.endLocation);
				let deltaValue: number = Math.abs(section.startValue - section.endValue);
				let percentage: number = 1 - (Math.abs(dataPoint - section.endValue) / deltaValue);
				let p: Point2D = new Point2D(this.scaleOffset.x * this.mmPerPixel, (section.startLocation+ (deltaY * percentage)));
				return p;
			}
		}
		
		return new Point2D(0,0);
	}
	
	public draw(gc: GraphicsContext): void
	{
		let offsetX: number = this.mmPerPixel * this.scaleOffset.x;
		let offsetY: number = this.mmPerPixel * this.scaleOffset.y;
		
		gc.save();
		gc.translate(offsetX, offsetY);
		gc.rotate(45);
		gc.translate(-offsetX, -offsetY);
		
		// draw shaded regions first
		this.drawShadedRegions(offsetX, offsetY, gc);
		
		// draw main axis spine
		this.drawMainAxisSpine(offsetX, offsetY, gc, true);
		
		// draw the section
		gc.moveTo(offsetX, offsetY + (this.mmPerPixel*this.mmStartOffset));
		let startPixel:number = offsetY + (this.mmStartOffset*this.mmPerPixel);
		
		this.sections.forEach((section) =>
		{
			let deltaValue = Math.abs(section.startValue - section.endValue) / (section.numDivisions - 1);
			let deltaPixel = (section.mmWidth * this.mmPerPixel) / (section.numDivisions - 1);
			let startValue = section.startValue;
			let lastIndex = section.numDivisions - 1;
			
			for (let i = 0; i < section.numDivisions; i++)
			{
				gc.font(this.charactistics.fontSize + 'px Arial');
				gc.setFill((this.charactistics.color != null) ? section.color : "black");
				if (this.charactistics.labelSide == LabelSide.LEFT && ((i == lastIndex && section.drawLast) || i != lastIndex))
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
		})
		
		gc.restore();
		
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
				gc.fillOval(posOffsetX + offsetX + this.label.stepNumLocation.x-2, posOffsetY + offsetY + this.label.stepNumLocation.y, 16, 16);
				
				gc.setFill(this.label.labelColor);
				gc.fillOval(posOffsetX + offsetX + this.label.stepNumLocation.x + 24, posOffsetY + offsetY + this.label.stepNumLocation.y, 16, 16);
				gc.setFill("white");
				gc.fillOval(posOffsetX + offsetX + this.label.stepNumLocation.x + 25, posOffsetY + offsetY + this.label.stepNumLocation.y + 1, 14, 14);
				
				gc.setFill(this.label.labelColor);
				gc.fillRect(posOffsetX + offsetX + this.label.stepNumLocation.x + 8, posOffsetY + offsetY + this.label.stepNumLocation.y, 24, 16);
				gc.setFill("white");
				gc.fillRect(posOffsetX + offsetX + this.label.stepNumLocation.x + 15, posOffsetY + offsetY + this.label.stepNumLocation.y + 1, 18, 14);
				
				gc.setFill("white");
            	gc.font('bold 14px Arial');
				gc.fillText(this.label.stepNum, posOffsetX + offsetX +this. label.stepNumLocation.x + 1, posOffsetY + offsetY + this.label.stepNumLocation.y + 11);
				gc.translate(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y);
				gc.restore();
				
				gc.setFill("black");
				gc.font("14px Sans Bold");
				gc.fillText((Math.ceil(this.value * 100) / 100).toFixed(2), posOffsetX + offsetX + this.label.stepNumLocation.x + 10, posOffsetY + offsetY + this.label.stepNumLocation.y + 11);
			}
			else 
			{
				gc.save();
				gc.setFill(this.label.labelColor);
				gc.fillOval(offsetX + this.label.stepNumLocation.x, offsetY + this.label.stepNumLocation.y, 11, 11);
				gc.setFill("white");
            	gc.font('14px Arial');
				gc.fillText(this.label.stepNum, posOffsetX + offsetX +this. label.stepNumLocation.x - 7, posOffsetY + offsetY + this.label.stepNumLocation.y + 5);
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
