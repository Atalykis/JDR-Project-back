export class Room {
  public users: Set<string>;
  constructor(public readonly name: string, public readonly gm: string, public readonly adventure: string) {
    this.users = new Set();
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

  get members(): string[] {
    return [...this.users];
  }
}
