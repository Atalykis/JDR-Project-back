import { UserStore } from "./user.store";

export interface AuthenticateUserCommand {
  username: string;
  password: string;
}

export class AuthenticateUserHandler {
  constructor(private readonly userStore: UserStore) {}

  handle(command: AuthenticateUserCommand) {
    const user = this.userStore.load(command.username);
    if (user && user.pass === command.password) {
      return user.username;
    }
    return null;
  }
}
