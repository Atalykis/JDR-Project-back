import { User } from "../../domain/user";
import { UserStoreInMemory } from "../../infrastructure/store/user.store.in-memory";
import { FakeTokenManager } from "../../infrastructure/token/fake.token-manager";
import { UserStore } from "../user.store";
import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterUserCommand, RegisterUserHandler } from "./register-user.command";

describe("RegisterUserCommand", () => {
  const tokenManager = new FakeTokenManager();
  const userStore = new UserStoreInMemory();
  const handler = new RegisterUserHandler(userStore, tokenManager);

  beforeEach(() => {
    userStore.clear();
  });

  it("should allow a newcomer to register as a User", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };

    handler.handle(command);

    const user = userStore.load("Aetherall");
    expect(user).toBeDefined();
  });

  it("should not allow to create two user with the same username", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };
    const user = new User("Aetherall", "pass");
    userStore.register(user);

    expect(() => handler.handle(command)).toThrow(CannotCreateUserWithAlreadyTakenUsernameError);
  });

  it("should return an access token for the user", () => {
    const command: RegisterUserCommand = { username: "Aetherall", password: "pass" };

    const token = handler.handle(command);
    expect(token).toEqual("token=>Aetherall");
  });
});
