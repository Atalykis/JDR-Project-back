import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { CharacterStore } from "../../application/character.store";
import { CharacterFixtures } from "../../domain/character.builder";
import { MongoDbClient } from "../mongodb/mongodb.client";
import { CharacterMongoStore } from "./character.mongo.store/character.mongo.store";
import { CharacterModel, CharacterSchema } from "./character.mongoose.store/character.mongoose.store";
import { CharacterMongooseStore } from "./character.mongoose.store/character.mongoose.store";
import { useMongooseStore } from "./character.mongoose.store/character.mongoose.store.spec";

function characterStoreTest(getCharacterStore: () => CharacterStore) {
  let store: CharacterStore;

  beforeAll(async () => {
    store = getCharacterStore();
  });

  afterAll(() => {
    store.clear()
  })

  it("should save a character", async () => {
    const character = CharacterFixtures.Adventurer;
    await store.add(character);
    const loaded = await store.loadAll();
    expect(loaded).toEqual([character]);
  });

  it("should load a specific character", async () => {
    const character = CharacterFixtures.Dio
    await store.add(character)

    const loaded = await store.load(character.identity)
    expect(loaded).toEqual(character)
  })

  it("should load many character owned by a user in a specific adventure", async () => {
    const character1 = CharacterFixtures.Jojo
    const character2 = CharacterFixtures.Jonathan
    await store.add(character1)
    await store.add(character2)

    const loaded = await store.loadOwnedForAdventure("Atalykis", "TheGreatEscape")
    expect(loaded).toEqual([character1, character2])
  })

  it("should load many specific character", async () => {
    const character1 = CharacterFixtures.Jojo
    const character2 = CharacterFixtures.Dio

    const loaded = await store.loadMany([character1.identity, character2.identity])
    expect(loaded).toEqual([character1, character2])
  })
}



describe("CharacterStore", () => {
  
  // describe("CharacterMongooseStore", () => {
    //   const getMongooseStore = useMongooseStore(CharacterMongooseStore, CharacterModel, CharacterSchema);
    //   characterStoreTest(getMongooseStore);
    // })
    
    describe("CharacterMongoStore", () => {
      beforeAll(async () => {
        await MongoDbClient.init("9000", "test")
      })

      afterAll(() => {
        MongoDbClient.close()
      })
      
    characterStoreTest(() => new CharacterMongoStore())
  })
});