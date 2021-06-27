import { User } from "../domain/user";
import { UserStore } from "../infrastructure/store/user.store";
import { UserStoreInMemory } from "../infrastructure/store/user.store.in-memory";
import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterUserCommand, RegisterUserHandler } from "./register-user.command";

describe("RegisterUserCommand", () => {
  it("should allow a newcomer to register as a User", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };
    const userStore: UserStore = new UserStoreInMemory();
    const handler = new RegisterUserHandler(userStore);

    handler.handle(command);

    const user = userStore.load("Aetherall");
    expect(user).toBeDefined;
  });

  it("should not allow to create two user with the same username", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };
    const userStore: UserStore = new UserStoreInMemory();
    const handler = new RegisterUserHandler(userStore);
    const user = new User("Aetherall", "pass");
    userStore.register(user);
    console.log(userStore);

    expect(() => handler.handle(command)).toThrow(CannotCreateUserWithAlreadyTakenUsernameError);
  });
});
