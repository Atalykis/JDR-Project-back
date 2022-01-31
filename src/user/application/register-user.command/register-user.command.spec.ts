import { User } from "../../domain/user";
import { UserStoreInMemory } from "../../infrastructure/store/user.store.in-memory";
import { UserStore } from "../user.store";
import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterUserCommand, RegisterUserHandler } from "./register-user.command";

describe("RegisterUserCommand", () => {
  it("should allow a newcomer to register as a User", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };
    const userStore = new UserStoreInMemory();
    const handler = new RegisterUserHandler(userStore);

    handler.handle(command);

    const user = userStore.load("Aetherall");
    expect(user).toBeDefined;
  });

  it("should not allow to create two user with the same username", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };
    const userStore = new UserStoreInMemory();
    const handler = new RegisterUserHandler(userStore);
    const user = new User("Aetherall", "pass");
    userStore.register(user);

    expect(() => handler.handle(command)).toThrow(CannotCreateUserWithAlreadyTakenUsernameError);
  });
});