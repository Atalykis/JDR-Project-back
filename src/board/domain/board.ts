import { Line } from "./line";

export interface OwnedLine {
  author: string;
  line: Line;
}

export class Board {
  constructor(public roomName: string, public lines: OwnedLine[] = []) {}

  draw(line: Line, author: string) {
    this.lines.push({ author, line });
  }
}
