export class CharacterIdentity {
  constructor(public readonly name: string, public readonly owner: string, public readonly adventure: string) {}

  equals(other: CharacterIdentity) {
    return CharacterIdentity.equals(this, other);
  }

  static equals(left: CharacterIdentity, right: CharacterIdentity) {
    if (left.name !== right.name) return false;
    if (left.owner !== right.owner) return false;
    if (left.adventure !== right.adventure) return false;
    return true;
  }

  toString() {
    return `${this.name} by ${this.owner} in ${this.adventure}`;
  }
}

export class Character {
  constructor(public readonly name: string, public readonly owner: string, public readonly adventure: string, public readonly description: string) {}

  get identity() {
    return new CharacterIdentity(this.name, this.owner, this.adventure);
  }
}
