export class Adventure {
  private players: Set<string>;
  constructor(public readonly name: string, public readonly mj: string) {
    this.players = new Set();
  }

  join(user: string) {
    this.players.add(user);
  }

  get adventurers() {
    return [...this.players];
  }
}
