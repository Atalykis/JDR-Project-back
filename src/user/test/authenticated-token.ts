import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
import { TokenManager } from "../application/token-manager";
import { UserStore } from "../application/user.store";
import { User } from "../domain/user";

export function makeGetAuthenticatedToken(module: TestingModule | INestApplication) {
  const userStore = module.get<UserStore>("UserStore");
  const tokenManager = module.get<TokenManager>("TokenManager");

  return function getAuthenticatedTokenFor(username: string) {
    let user = userStore.load(username);
    if (!user) {
      user = new User(username, "password");
      userStore.register(user);
    }

    return tokenManager.generateAccessToken(user);
  };
}
