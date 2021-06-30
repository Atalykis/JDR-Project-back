import { User } from "../../domain/user";
import { UserStore } from "../user.store";

export interface RegisterUserCommand {
  username: string;
  password: string;
}

export class RegisterUserHandler {
  constructor(private readonly userStore: UserStore) {}

  handle(command: RegisterUserCommand) {
    const alreadyExistingUser = this.userStore.load(command.username);

    if (alreadyExistingUser) {
      throw new CannotCreateUserWithAlreadyTakenUsernameError(command.username);
    }
    const user = new User(command.username, command.password);
    this.userStore.register(user);
  }
}

export class CannotCreateUserWithAlreadyTakenUsernameError extends Error {
  constructor(username: string) {
    super(`Could not create room ${username} because name was already taken`);
  }
}
