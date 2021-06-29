import { User } from "../../domain/user";
import { CryptrTokenManager } from "./crypto.token-manager";

describe("TokenManager", () => {
  it("should encode the username of the user", () => {
    const tokenManager = new CryptrTokenManager("secret_key");

    const token = tokenManager.generateAccessToken(new User("Joojo", "pass"));

    expect(tokenManager.getUsernameFromAccessToken(token)).toEqual("Joojo");
  });

  it("should not be allow to decode a token emitted with a different secret key", () => {
    const tokenManagerA = new CryptrTokenManager("secret_key_a");
    const token = tokenManagerA.generateAccessToken(new User("Joojo", "pass"));

    const tokenManagerB = new CryptrTokenManager("secret_key_b");
    expect(() => tokenManagerB.getUsernameFromAccessToken(token)).toThrow("InvalidToken");
  });
});
