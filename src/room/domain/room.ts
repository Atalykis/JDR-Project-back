import { Character } from "../../character/domain/character";

export class Room {
  public users: Set<string>;
  public characters: Set<Character>;
  constructor(public readonly name: string, public readonly gm: string, public readonly adventure: string) {
    this.users = new Set();
    this.characters = new Set();
  }

  has(user: string): boolean {
    return this.users.has(user);
  }

  join(user: string, character: Character): void {
    this.users.add(user);
    this.characters.add(character);
  }

  leave(user: string): void {
    this.users.delete(user);
  }

  kick(user: string): void {
    this.users.delete(user);
  }

  get members(): string[] {
    return [...this.users];
  }

  get adventurers(): Character[] {
    return [...this.characters];
  }
}
