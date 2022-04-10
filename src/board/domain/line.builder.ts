import { FixtureOf } from "../../typings/fixtures";
import { Line } from "./line";
import { Point } from "./point";
import { PointFixtures } from "./point.builder";

export class LineBuilder {
  points: Point[] = [];
  color: string;
  thickness: number;

  withColor(color: string) {
    this.color = color;
    return this;
  }

  withThickness(thickness: number) {
    this.thickness = thickness;
    return this;
  }

  addPoint(point: FixtureOf<typeof PointFixtures>) {
    const resolvedPoint = PointFixtures.resolve(point);
    this.points.push(resolvedPoint);
    return this;
  }

  build() {
    return new Line({
      points: this.points,
      color: "red",
      thickness: 1,
    });
  }
}

export class LineFixtures {
  static redDiagonal = new LineBuilder().withColor("#ff0000").withThickness(1).addPoint("topleft").addPoint("bottomright").build();

  static redCross = new LineBuilder()
    .withColor("#ff0000")
    .withThickness(1)
    .addPoint("topleft")
    .addPoint("center")
    .addPoint("topright")
    .addPoint("center")
    .addPoint("bottomright")
    .addPoint("center")
    .addPoint("bottomleft")
    .addPoint("center")
    .build();

  static greenSquare = new LineBuilder()
    .withColor("#00ff00")
    .withThickness(1)
    .addPoint("topleft")
    .addPoint("topright")
    .addPoint("bottomright")
    .addPoint("bottomleft")
    .addPoint("topleft")
    .build();

  static blueDash = new LineBuilder().withColor("#0000ff").withThickness(1).addPoint("center").addPoint("topleft").build();

  static redDash = new LineBuilder().withColor("#ff0000").withThickness(1).addPoint("center").addPoint("bottomright").build();
  static resolve(line: FixtureOf<typeof LineFixtures>): Line {
    if (line instanceof Line) {
      return line;
    }
    return LineFixtures[line];
  }
}
