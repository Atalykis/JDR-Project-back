import { TokenManager } from "../token-manager";

export class GetUserInfoQuery {
  constructor(public token: string) {}
}

export class GetUserInfoQueryHandler {
  constructor(public tokenManager: TokenManager) {}

  handle(query: GetUserInfoQuery) {
    return { name: this.tokenManager.getUsernameFromAccessToken(query.token) };
  }
}
