import { Point2D } from '../SupportObjects/Point2D'
import { GraphicsContext } from '../SupportObjects/GraphicsContext';

export interface Scale 
{
	containsClick(x: number, y: number): boolean;
	isDraggingDot(x: number, y: number, scaleMargin: number): boolean;
	isShowDraggable(): boolean;
	draw(gc: GraphicsContext): void;
	drawDraggableNotch(gc: GraphicsContext): void;
	getDataPointForSlideValue(slideValue: number): number;
	getPointForSlideValue(slideValue: number): Point2D;
}