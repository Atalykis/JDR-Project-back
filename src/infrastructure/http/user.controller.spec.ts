import { HttpStatus, INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest";
import { UserStore } from "../../application/user.store"
import { UserModule } from "../../user.module";

describe("UserController", () => {
    let app: INestApplication
    let userStore: UserStore

    beforeAll(async () => {
        const module = await Test.createTestingModule({ imports: [UserModule] }).compile();
        userStore = module.get<UserStore>("UserStore");
        
        app = module.createNestApplication();
        await app.init(); 
    })

    it("should create a new user", async () => {
        const { status, text } = await request(app.getHttpServer()).post("/register").send({ username: "NewUser", password: "pass" });
        
        expect(status).toBe(HttpStatus.CREATED);

        const createdUser = userStore.load("NewUser")
        expect(createdUser).toMatchObject({username: "NewUser", password: "pass"})
    })
})

