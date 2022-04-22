import { CharacterIdentity } from "../../character/domain/character";

export class Room {
  public users: Set<string>;
  public characters: Set<CharacterIdentity>;
  constructor(public readonly name: string, public readonly gm: string, public readonly adventure: string) {
    this.users = new Set();
    this.characters = new Set();
  }

  has(user: string): boolean {
    return this.users.has(user);
  }

  join(user: string): void {
    this.users.add(user);
  }

  leave(user: string): void {
    this.users.delete(user);
  }

  kick(user: string): void {
    this.users.delete(user);
  }

  addCharacter(character: CharacterIdentity): void {
    this.characters.add(character);
  }

  get members(): string[] {
    return [...this.users];
  }

  get adventurers(): CharacterIdentity[] {
    return [...this.characters];
  }
}
