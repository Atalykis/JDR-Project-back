import { FixtureOf } from "../../typings/fixtures";
import { Board, OwnedLine, OwnedToken } from "./board";
import { Line } from "./line";
import { LineFixtures } from "./line.builder";
import { TokenFixture } from "./token.builder";

export class BoardBuilder {
  roomName: string;

  lines: OwnedLine[] = [];

  tokens: OwnedToken[] = []

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

  withbasicsTokens(){
    this.tokens.push({owner: "Atalykis" ,token :TokenFixture.basic50})
    this.tokens.push({owner: "Aetherall" ,token :TokenFixture.basic150})

    return this
  }

  build() {
    return new Board(this.roomName, this.lines, this.tokens);
  }
}
