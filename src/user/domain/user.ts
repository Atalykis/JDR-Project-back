export class User {
  constructor(public username: string, private password: string) {}

  get pass(): string {
    return this.password;
  }

  hasToken(_token: string) {
    return true;
  }

  createAccessToken() {}
}
