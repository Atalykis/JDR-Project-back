import { User } from "../domain/user";
import { UserStoreInMemory } from "../infrastructure/user.store.in-memory";
import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterCommand, RegisterHandler } from "./register.command";
import { UserStore } from "./user.store";

describe("RegisterUserCommand", () => {
  it("should allow a newcomer to register as a User", () => {
    const command: RegisterCommand = { username: "Aetherall", password: "pass" };
    const userStore: UserStore = new UserStoreInMemory();
    const handler = new RegisterHandler(userStore);

    handler.handle(command);

    const user = userStore.load("Aetherall");
    expect(user).toBeDefined;
  });

  it("should not allow to create two user with the same username", () => {
    const command: RegisterCommand = { username: "Aetherall", password: "pass" };
    const userStore: UserStore = new UserStoreInMemory();
    const handler = new RegisterHandler(userStore);
    const user = new User("Aetherall", "pass");
    userStore.register(user);
    console.log(userStore);

    expect(() => handler.handle(command)).toThrow(CannotCreateUserWithAlreadyTakenUsernameError);
  });
});
