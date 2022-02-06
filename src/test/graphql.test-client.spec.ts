import { INestApplication } from "@nestjs/common";
import { DocumentNode, print } from "graphql";
import request from "supertest";
import { makeGetAuthenticatedToken } from "../user/test/authenticated-token";

export class GraphqlTestClient {
  token?: string;
  private readonly getAuthenticatedToken: (username: string) => string;

  constructor(public app: INestApplication) {
    this.getAuthenticatedToken = makeGetAuthenticatedToken(this.app);
  }

  as(username: string) {
    this.token = this.getAuthenticatedToken(username);
  }

  unauthenticated() {
    delete this.token;
  }

  async execute(query: DocumentNode) {
    const { body } = await request(this.app.getHttpServer())
      .post("/graphql")
      .set("Authorization", this.token || "")
      .send({ query: print(query) });
    return body;
  }
}
