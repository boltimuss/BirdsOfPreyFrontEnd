import { NomographCharacteristics } from "../NomographCharacteristics";
import { Point2D } from "../SupportObjects/Point2D";
import { Section } from "../Section";
import { ShadedRegion } from "../ShadedRegion";
import { Scale } from "./Scale";
import { ScaleLabel } from "./ScaleLabel";
import { Rectangle2D } from "../SupportObjects/Rectangle2D"
import { GraphicsContext } from "../SupportObjects/GraphicsContext";

export abstract class AbstractScale implements Scale
{
    mmPerPixel: number;
    sections: Array<Section>;
    mmHeight: number;
    mmWidth: number;
    mmStartOffset: number;
    charactistics: NomographCharacteristics;
    scaleOffset: Point2D;
    shadedRegions: Array<ShadedRegion>;
    showDraggable: boolean;
    label: ScaleLabel;
    value: number = 0.0;
    isDragging: boolean;
    clickZone: Rectangle2D;
    draggableOffset: Point2D = new Point2D(0, 0);
    mouseSceneOffset:Point2D = new Point2D(0, 0);
    draggableX: number = -99;
    draggableY: number = -99;

    constructor()
    {
        this.mmPerPixel = (window.devicePixelRatio * 96)/25.4;
    }

    isShowDraggable(): boolean {
        return this.showDraggable;
    }

    containsClick(x: number, y: number): boolean {
        throw new Error("Method not implemented.");
    }
    isDraggingDot(x: number, y: number, scaleMargin: number): boolean {
        throw new Error("Method not implemented.");
    }
    draw(gc: GraphicsContext): void {
        throw new Error("Method not implemented.");
    }
    drawDraggableNotch(gc: GraphicsContext): void {
        throw new Error("Method not implemented.");
    }
    getDataPointForSlideValue(slideValue: number): number {
        throw new Error("Method not implemented.");
    }
    getPointForSlideValue(slideValue: number): Point2D {
        throw new Error("Method not implemented.");
    }

}