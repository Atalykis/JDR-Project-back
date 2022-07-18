import { CharacterIdentity } from "../../character/domain/character";
import { Line } from "./line";
import { Position, Token } from "./token";

export interface OwnedLine {
  author: string;
  line: Line;
}

export interface OwnedToken {
  owner: string;
  token: Token;
}

export class Board {
  constructor(public roomName: string, public lines: OwnedLine[] = [], public tokens: OwnedToken[] = []) {}

  drawLine(line: Line, author: string) {
    this.lines.push({ author, line });
  }

  moveToken(id: CharacterIdentity, newPosition: Position, author: string) {
    const moved = this.tokens.find((token) => token.owner === author && token.token.identity.equals(id));
    if (!moved) return;
    moved.token.move(newPosition);
    return moved;
  }
}
