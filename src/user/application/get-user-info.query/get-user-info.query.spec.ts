import { FakeTokenManager } from "../../infrastructure/token/fake.token-manager";
import { GetUserInfoQuery, GetUserInfoQueryHandler } from "./get-user-info.query";

describe("get user query", () => {
  it("should retrieve my username with an access token", async () => {
    const tokenManager = new FakeTokenManager();
    const handler = new GetUserInfoQueryHandler(tokenManager);

    const query = new GetUserInfoQuery("token=>zeph0");

    expect(await handler.handle(query)).toEqual({ name: "zeph0" });
  });
});
