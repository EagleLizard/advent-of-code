
export class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
  static copy(point: Point): Point {
    return new Point(point.x, point.y);
  }
}
