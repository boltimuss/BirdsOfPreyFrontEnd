import { Point2D } from "../Nomograph/Point2D";

export class AircraftState 
{

	private keas: number;
	private mach: number;
	private qPoint: Point2D = new Point2D(0,0);
	private engineDeltaSpeed: number;
}