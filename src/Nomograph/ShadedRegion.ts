export class ShadedRegion {

	width: number;
	startValue: number; 
	endValue: number; 
	yMMStart: number;
	yMMEnd: number;
	useYValue: boolean;
	color: string;
	
	public static builder(): ShadedRegion
	{
		return new ShadedRegion();
	}

	public setWidth(width: number): ShadedRegion
	{
		this.width = width;
		return this;

	}
	public setStartValue(startValue: number): ShadedRegion
	{
		this.startValue = startValue;
		return this;

	}
	public setEndValue(endValue: number): ShadedRegion
	{
		this.endValue = endValue;
		return this;

	}
	public setyMMStart(yMMStart: number): ShadedRegion
	{
		this.yMMStart = yMMStart;
		return this;

	}
	public setyMMEnd(yMMEnd: number): ShadedRegion
	{
		this.yMMEnd = yMMEnd;
		return this;

	}
	public setUseYValue(useYValue: boolean): ShadedRegion
	{
		this.useYValue = useYValue;
		return this;

	}
	public setColor(color: string): ShadedRegion
	{
		this.color = color;
		return this;

	}
}