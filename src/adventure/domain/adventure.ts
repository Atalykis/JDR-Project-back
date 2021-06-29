export class Adventure {
  private users: Set<string>;
  constructor(public readonly name: string, public readonly mj: string) {
    this.users = new Set();
  }

  join(user: string) {
    this.users.add(user);
  }

  get adventurers() {
    return [...this.users];
  }
}
