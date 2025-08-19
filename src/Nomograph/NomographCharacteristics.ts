import './LabelSide'
import { LabelSide } from './LabelSide';
import { Point2D } from './SupportObjects/Point2D';

export class NomographCharacteristics
{

	labelSide: LabelSide;
	isDescending: boolean;
	fontSize: number;
	fontHeightOffset: number;
	tickWidthHeight: number;
	lineWidth: number;
	color: string;
	rotation: number;
	rotationOffset: Point2D
	isHorizontal: boolean = false;

	public static builder(): NomographCharacteristics
	{
		return new NomographCharacteristics();
	}

	public setIsHorizontal(isHorizontal: boolean): NomographCharacteristics
	{
		this.isHorizontal = isHorizontal;
		return this;
	}

	public setRotationOffset(rotationOffset: Point2D): NomographCharacteristics
	{
		this.rotationOffset = rotationOffset;
		return this;
	}

	public setRotation(rotation: number): NomographCharacteristics
	{
		this.rotation = rotation;
		return this;
	}

	public setLabelSide(labelSide: LabelSide): NomographCharacteristics
	{
		this.labelSide = labelSide;
		return this;
	}

	public setIsDescending(isDescending: boolean): NomographCharacteristics
	{
		this.isDescending = isDescending;
		return this;
	}

	public setFontSize(fontSize: number): NomographCharacteristics
	{
		this.fontSize = fontSize;
		return this;
	}

	public setFontHeightOffset(fontHeightOffset: number): NomographCharacteristics
	{
		this.fontHeightOffset = fontHeightOffset;
		return this;
	}

	public setTickWidthHeight(tickWidthHeight: number): NomographCharacteristics
	{
		this.tickWidthHeight = tickWidthHeight;
		return this;
	}

	public setLineWidth(lineWidth: number): NomographCharacteristics
	{
		this.lineWidth = lineWidth;
		return this;
	}

	public setColor(color: string): NomographCharacteristics
	{
		this.color = color;
		return this;
	}

}