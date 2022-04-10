import { FixtureOf } from "../../typings/fixtures";
import { Board, OwnedLine } from "./board";
import { Line } from "./line";
import { LineFixtures } from "./line.builder";

export class BoardBuilder {
  roomName: string;

  lines: OwnedLine[] = [];

  withRoomName(roomName: string) {
    this.roomName = roomName;
    return this;
  }

  addLineAs(line: FixtureOf<typeof LineFixtures>, user: string) {
    this.lines.push({
      line: LineFixtures.resolve(line),
      author: user,
    });

    return this;
  }

  build() {
    return new Board(this.roomName, this.lines);
  }
}
