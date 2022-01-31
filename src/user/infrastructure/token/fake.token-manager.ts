import { TokenManager } from "../../application/token-manager";
import { User } from "../../domain/user";

export class FakeTokenManager implements TokenManager {
  generateAccessToken(user: User) {
    return `token=>${user.username}`;
  }

  getUsernameFromAccessToken(token: string): string {
    const [_token, username] = token.split("=>");
    return username;
  }
}
