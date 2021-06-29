export class User {
  constructor(public username: string, private password: string) {}

  hasToken(_token: string) {
    return true;
  }

  get pass() {
    return this.password;
  }
}
