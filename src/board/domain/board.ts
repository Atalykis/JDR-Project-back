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

  moveToken(token: Token, author: string) {
    const moved = this.tokens.find((t) => t.owner === author && t.token.identity.equals(token.identity));
    if (!moved) return;
    moved.token.move(token.pos);
    return moved;
  }

  addToken(owner: string, token: Token){
    this.tokens.push({owner, token})
  }
}
