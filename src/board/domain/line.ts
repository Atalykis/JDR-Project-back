import { Value } from "@ddd-ts/value";
import { Point } from "./point";

export class Line extends Value({ points: [Point], color: String, thickness: Number }) {
  ensureValidity() {
    if (this.value.points.length < 2) {
      throw new Error("Line must have at least 2 points");
    }
  }
}
