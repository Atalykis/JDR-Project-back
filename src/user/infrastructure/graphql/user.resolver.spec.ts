import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { gql } from "apollo-server-express";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { User } from "../../domain/user";
import { UserStoreInMemory } from "../store/user.store.in-memory";

describe("User Resolver", () => {
  let app: INestApplication;
  let graphql: GraphqlTestClient;

  const userStore = new UserStoreInMemory();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider("UserStore")
      .useValue(userStore)
      .compile();

    app = module.createNestApplication();
    await app.init();

    graphql = new GraphqlTestClient(app);
    await graphql.as("Atalykis");
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    userStore.clear();
  });

  describe("UserRegistration Mutation", () => {
    const mutation = gql`
      mutation UserRegistration($username: String!, $password: String!) {
        register(username: $username, password: $password) {
          username
        }
      }
    `;
    it("should register a new user", async () => {
      const { errors } = await graphql.execute(mutation, {
        username: "Atalykis",
        password: "123456",
      });

      const createdUser = await userStore.load("Atalykis");

      expect(errors).toBeUndefined();
      expect(createdUser).toBeDefined();
    });
  });

  describe("UserLogin Mutation", () => {
    const mutation = gql`
      mutation UserLogin($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
        }
      }
    `;
    it("should login a user", async () => {
      await userStore.register(new User("Atalykis", "123456"));
      const { errors, data } = await graphql.execute(mutation, {
        username: "Atalykis",
        password: "123456",
      });

      const user = await userStore.load("Atalykis");

      expect(errors).toBeUndefined();
      expect(user!.hasToken(data.login)).toBe(true);
    });
  });
});
