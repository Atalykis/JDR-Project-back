import { User } from "../../domain/user";
import { UserStoreInMemory } from "../../infrastructure/store/user.store.in-memory";
import { AuthenticateUserCommand, AuthenticateUserHandler } from "./authenticate-user.command";

it("should return the user without password in case of succes", () => {
  const command: AuthenticateUserCommand = { username: "Aetherall", password: "pass" };
  const userStore = new UserStoreInMemory();
  const user = new User("Aetherall", "pass");
  userStore.register(user);
  const handler = new AuthenticateUserHandler(userStore);

  const username = handler.handle(command);

  expect(username).toEqual(user.username);
});
