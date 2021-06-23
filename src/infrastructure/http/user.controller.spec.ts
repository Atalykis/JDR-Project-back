import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserStore } from "../../application/user.store";
import { User } from "../../domain/user";
import { UserModule } from "../../user.module";

describe("UserController", () => {
  let app: INestApplication;
  let userStore: UserStore;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [UserModule] }).compile();
    userStore = module.get<UserStore>("UserStore");

    app = module.createNestApplication();
    await app.init();
  });

  describe("UserRegistration", () => {
    it("should create a new user", async () => {
      const { status } = await request(app.getHttpServer()).post("/register").send({ username: "NewUser", password: "pass" });

      expect(status).toBe(HttpStatus.CREATED);

      const createdUser = userStore.load("NewUser");
      expect(createdUser).toMatchObject({ username: "NewUser", password: "pass" });
    });

    it("should not allow to create a user if the username is already taken", async () => {
      const user = new User("existingUser", "pass");
      userStore.register(user);

      const { status } = await request(app.getHttpServer()).post("/register").send({ username: "existingUser", password: "pass" });

      expect(status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe("UserLogin", () => {
    it("should authenticate a user", async () => {
      const { status, text } = await request(app.getHttpServer()).post("/login").send({ username: "NewUser", password: "pass" });

      expect(status).toBe(HttpStatus.OK);
      expect(text).toEqual("NewUser");
    });
  });
});
