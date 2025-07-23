import { Point2D } from "../SupportObjects/Point2D";

export class Rectangle2D {

    static EMPTY: Rectangle2D  = new Rectangle2D(0, 0, 0, 0);

    /**
     * The x coordinate of the upper-left corner of this Rectangle2D.
     *
     * @return the x coordinate of the upper-left corner
     * @defaultValue 0.0
     */
    public getMinX(): number { return this.minX; }
    private minX: number;

    /**
     * The y coordinate of the upper-left corner of this Rectangle2D.
     *
     * @return the y coordinate of the upper-left corner
     * @defaultValue 0.0
     */
    public getMinY(): number { return this.minY; }
    private minY: number;

    /**
     * The width of this  Rectangle2D.
     *
     * @return the width
     * @defaultValue 0.0
     */
    public getWidth(): number { return this.width; }
    private width: number;

    /**
     * The height of this  Rectangle2D.
     *
     * @return the height
     * @defaultValue 0.0
     */
    public getHeight(): number { return this.height; }
    private height: number;

    /**
     * The x coordinate of the lower-right corner of this Rectangle2D.
     *
     * @return the x coordinate of the lower-right corner
     * @defaultValue minX + width
     */
    public getMaxX(): number{ return this.maxX; }
    private maxX: number;

    /**
     * The y coordinate of the lower-right corner of this Rectangle2D.
     *
     * @return the y coordinate of the lower-right corner
     * @defaultValue minY + height
     */
    public getMaxY(): number { return this.maxY; }
    private maxY: number;

    /**
     * Cache the hash code to make computing hashes faster.
     */
    private hash: number = 0;

    constructor (minX: number, minY: number, width: number, height: number) 
    {
        if (width < 0 || height < 0) {
            throw new Error("Both width and height must be >= 0");
        }

        this.minX = minX;
        this.minY = minY;
        this.width = width;
        this.height = height;
        this.maxX = minX + width;
        this.maxY = minY + height;
    }

   /**
    * Tests if the specified point is inside the boundary of Rectangle2D.
    *
    * @param p the specified point to be tested
    * @return true if the specified point is inside the boundary of this
    * Rectangle2D; false otherwise
    */
    public contains(p: Point2D): boolean {
        if (p == null) return false;
        return p.x >= this.minX && p.x <= this.maxX && p.y >= this.minY && p.y <= this.maxY;
    }
}
