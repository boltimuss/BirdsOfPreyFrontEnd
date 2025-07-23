import { Point2D } from "../SupportObjects/Point2D"

export class ScaleLabel {

	labelColor: string;
	label: string;
	drawValue: boolean;
	stepNum: string;
	stepNumLocation: Point2D;
	scaleLocation: Point2D;
	scaleOffset: Point2D;
	rotation: number = 0;
	
	public static builder(): ScaleLabel
	{
		return new ScaleLabel();
	}

	public setLabelColor(labelColor: string): ScaleLabel
	{
		this.labelColor = labelColor;
		return this;

	}

	public setLabel(label: string): ScaleLabel
	{
		this.label = label;
		return this;

	}

	public setDrawValue(drawValue: boolean): ScaleLabel
	{
		this.drawValue = drawValue;
		return this;

	}

	public setStepNum(stepNum: string): ScaleLabel
	{
		this.stepNum = stepNum;
		return this;

	}

	public setStepNumLocation(stepNumLocation: Point2D): ScaleLabel
	{
		this.stepNumLocation = stepNumLocation;
		return this;

	}

	public setScaleLocation(scaleLocation: Point2D): ScaleLabel
	{
		this.scaleLocation = scaleLocation;
		return this;

	}

	public setScaleOffset(scaleOffset: Point2D): ScaleLabel
	{
		this.scaleOffset = scaleOffset;
		return this;

	}

	public setRotation(rotation: number): ScaleLabel
	{
		this.rotation = rotation;
		return this;

	}
}