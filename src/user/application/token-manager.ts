import { User } from "../domain/user";

export interface TokenManager {
  generateAccessToken(user: User): string;
  getUsernameFromAccessToken(token: string): string;
}
