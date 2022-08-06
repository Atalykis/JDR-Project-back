import { Value } from "@ddd-ts/value";

import { CharacterIdentity } from "../../character/domain/character";

export class Position extends Value({
  x: Number,
  y: Number,
}) {}

export class Size extends Value({
  width: Number,
  height: Number,
}) {}

// export class Token extends Value({ position: Position, size: Size, image: String }) {}

export class Token {
  constructor(private position: Position, private size: Size, private imageSrc: string, private id: CharacterIdentity) {}

  move(position: Position) {
    this.position = position;
  }

  get identity() {
    return this.id;
  }

  get pos() {
    return this.position;
  }

  serialize() {
    return {
      id: this.id.toObject(),
      position: this.position.serialize(),
      size: this.size.serialize(),
      imageSrc: this.imageSrc,
    };
  }
}
