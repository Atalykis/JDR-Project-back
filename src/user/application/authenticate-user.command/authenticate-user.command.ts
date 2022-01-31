import { TokenManager } from "../token-manager";
import { UserStore } from "../user.store";

export interface AuthenticateUserCommand {
  username: string;
  password: string;
}

export class AuthenticateUserHandler {
  constructor(private readonly userStore: UserStore, private readonly tokenManager: TokenManager) {}

  handle(command: AuthenticateUserCommand) {
    const user = this.userStore.load(command.username);
    if (user && user.pass === command.password) {
      return this.tokenManager.generateAccessToken(user);
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
