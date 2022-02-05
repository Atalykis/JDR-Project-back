import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { authorize } from "passport";
import request from "supertest";

import { makeGetAuthenticatedToken } from "../../../user/test/authenticated-token";
import { CharacterStore } from "../../application/character.store";
import { CharacterModule } from "../../character.module";
import { Character } from "../../domain/character";

describe("CharcterController", () => {
  let app: INestApplication;
  let characterStore: CharacterStore;

  let getAuthenticatedTokenFor: ReturnType<typeof makeGetAuthenticatedToken>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [CharacterModule] }).compile();
    characterStore = module.get<CharacterStore>("CharacterStore");
    getAuthenticatedTokenFor = makeGetAuthenticatedToken(module);

    app = module.createNestApplication();
    await app.init();
  });

  describe("Character creation", () => {
    it("should allow a user to create a character in an Adventure", async () => {
      const token = getAuthenticatedTokenFor("Atalykis");

      const { status, text } = await request(app.getHttpServer())
        .post("/character")
        .set("Authorization", token)
        .send({ name: "JojoO", description: "You were exptecting a description, but it was me DIO", adventure: "TheGreatEscape" });

      expect(status).toBe(HttpStatus.CREATED);
      expect(text).toBe("JojoO");
    });
  });

  describe("Character retrieval", () => {
    it("should allow a user to retrieve his characters in an Adventure", async () => {
      const token = getAuthenticatedTokenFor("Atalykis");
      const main = new Character("Jojoo", "Atalykis", "description", "TheGreatEscape");
      const smurf = new Character("oojoJ", "Atalykis", "noitpircsed", "TheGreatEscape");
      characterStore.add(main);
      characterStore.add(smurf);

      const { status, body } = await request(app.getHttpServer())
        .get("/characters")
        .set("Authorization", token)
        .query({ adventure: "TheGreatEscape" });

      expect(status).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.arrayContaining([
          { name: "Jojoo", owner: "Atalykis", description: "description", adventure: "TheGreatEscape" },
          { name: "oojoJ", owner: "Atalykis", description: "noitpircsed", adventure: "TheGreatEscape" },
        ])
      );
    });
  });
});
