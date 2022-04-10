import { FixtureOf } from "../../typings/fixtures";

import { Point } from "./point";

export class PointFixtures {
  static topleft = new Point({ x: 0, y: 0 });
  static topright = new Point({ x: 999, y: 0 });
  static bottomleft = new Point({ x: 0, y: 999 });
  static bottomright = new Point({ x: 999, y: 999 });
  static center = new Point({ x: 500, y: 500 });

  static resolve(point: FixtureOf<typeof PointFixtures>) {
    if (point instanceof Point) {
      return point;
    } else {
      return PointFixtures[point];
    }
  }
}
