export class Section 
{
	mmHeight: number;
	mmWidth: number;
	numDivisions: number;
	startValue: number;
	endValue: number;
	fontAxisOffset: number;
	fontAxisOffsetLast: number;
	drawLast : boolean = false;
	startLocation: number;
	endLocation: number;
	color: string;

	public static builder(): Section
	{
		return new Section();
	}

	public setMMHeight(mmHeight: number): Section
	{
		this.mmHeight = mmHeight;
		return this;

	}
	
	public setMMWidth(mmWidth: number): Section
	{
		this.mmWidth = mmWidth;
		return this;
	}

	public setNumDivisions(numDivisions: number): Section
	{
		this.numDivisions = numDivisions;
		return this;
	}

	public setStartValue(startValue: number): Section
	{
		this.startValue = startValue;
		return this;
	}

	public setEndValue(endValue: number): Section
	{
		this.endValue = endValue;
		return this;
	}

	public setFontAxisOffset(fontAxisOffset: number): Section
	{
		this.fontAxisOffset = fontAxisOffset;
		return this;
	}

	public setFontAxisOffsetLast(fontAxisOffsetLast: number): Section
	{
		this.fontAxisOffsetLast = fontAxisOffsetLast;
		return this;
	}

	public setDrawLast(drawLast: boolean): Section
	{
		this.drawLast = drawLast;
		return this;
	}

	public setStartLocation(startLocation: number): Section
	{
		this.startLocation = startLocation;
		return this;
	}

	public setEndLocation(endLocation: number): Section
	{
		this.endLocation = endLocation;
		return this;
	}

	public setColor(color: string): Section
	{
		this.color = color;
		return this;
	}
}