import { User } from "../domain/user";
import { UserStoreInMemory } from "../infrastructure/user.store.in-memory";
import { AuthenticateUserCommand, AuthenticateUserHandler } from "./authenticate-user.command";
import { UserStore } from "./user.store";

it("should return the user without password in case of succes", () => {
  const command: AuthenticateUserCommand = { username: "Aetherall", password: "pass" };
  const userStore: UserStore = new UserStoreInMemory();
  const user = new User("Aetherall", "pass");
  const handler = new AuthenticateUserHandler(userStore);

  const username = handler.handle(command);

  expect(user).toMatchObject({ username: "Aetherall" });
});
