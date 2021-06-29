import { UserStore } from "../infrastructure/store/user.store";

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
    } else {
      throw new CannotAuthenticateUserError(command.username);
    }
  }
}

export class CannotAuthenticateUserError extends Error {
  constructor(username: string) {
    super(`Cannot login with the username ${username} you should check your password`);
  }
}
