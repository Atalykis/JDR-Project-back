import Cryptr from "cryptr";

import { TokenManager } from "../../application/token-manager";
import { User } from "../../domain/user";

export class CryptrTokenManager implements TokenManager {
  cryptr: Cryptr;
  constructor(private readonly secret_key: string) {
    this.cryptr = new Cryptr(this.secret_key);
  }

  generateAccessToken(user: User) {
    return this.cryptr.encrypt(user.username);
  }

  getUsernameFromAccessToken(token: string): string {
    try {
      return this.cryptr.decrypt(token);
    } catch (error) {
      throw "InvalidToken";
    }
  }
}
