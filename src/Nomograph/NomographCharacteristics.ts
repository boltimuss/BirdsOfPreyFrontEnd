import './LabelSide'
import { LabelSide } from './LabelSide';

export class NomographCharacteristics
{

	labelSide: LabelSide;
	isDescending: boolean;
	fontSize: number;
	fontHeightOffset: number;
	tickWidthHeight: number;
	lineWidth: number;
	color: string;

	public static builder(): NomographCharacteristics
	{
		return new NomographCharacteristics();
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