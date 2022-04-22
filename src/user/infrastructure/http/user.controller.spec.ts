import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserStore } from "../../application/user.store";
import { User } from "../../domain/user";
import { FakeTokenManager } from "../token/fake.token-manager";
import { UserModule } from "../user.module";

describe("UserController", () => {
  let app: INestApplication;
  let userStore: UserStore;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [UserModule] })
      .overrideProvider("TokenManager")
      .useValue(new FakeTokenManager())
      .compile();
    userStore = module.get<UserStore>("UserStore");

    app = module.createNestApplication();

    await app.init();
  });

  describe("UserRegistration", () => {
    it("should create a new user", async () => {
      const { status } = await request(app.getHttpServer()).post("/register").send({ username: "NewUser", password: "pass" });

      expect(status).toBe(HttpStatus.CREATED);

      const createdUser = await userStore.load("NewUser");
      expect(createdUser).toMatchObject({ username: "NewUser", password: "pass" });
    });

    it("should not allow to create a user if the username is already taken", async () => {
      const user = new User("existingUser", "pass");
      await userStore.register(user);

      const { status } = await request(app.getHttpServer()).post("/register").send({ username: "existingUser", password: "pass" });

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe("UserLogin", () => {
    it("should authenticate a user", async () => {
      await userStore.register(new User("Jojoo", "superpass"));

      const { status, text } = await request(app.getHttpServer()).post("/login").send({
        username: "Jojoo",
        password: "superpass",
      });

      expect(status).toBe(HttpStatus.OK);

      const user = await userStore.load("Jojoo");

      expect(user!.hasToken(text)).toBe(true);
    });

    it("should return 403 Unauthorized if the login fails", async () => {
      await userStore.register(new User("Jojoo", "superpass"));

      const { status } = await request(app.getHttpServer()).post("/login").send({
        username: "Jojoo",
        password: "wrong",
      });

      expect(status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
