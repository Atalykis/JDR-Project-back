import { User } from "../../domain/user";
import { UserStoreInMemory } from "../../infrastructure/store/user.store.in-memory";
import { FakeTokenManager } from "../../infrastructure/token/fake.token-manager";
import { AuthenticateUserCommand, AuthenticateUserHandler } from "./authenticate-user.command";

it("should return an authentication token in case of success", async () => {
  const command: AuthenticateUserCommand = { username: "Aetherall", password: "pass" };
  const userStore = new UserStoreInMemory();
  const tokenManager = new FakeTokenManager();
  const user = new User("Aetherall", "pass");
  await userStore.register(user);
  const handler = new AuthenticateUserHandler(userStore, tokenManager);

  const token = await handler.handle(command);

  expect(token).toEqual("token=>Aetherall");
});
