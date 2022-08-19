import { Test, TestingModule } from "@nestjs/testing";
import { MongoDbClient } from "../../mongodb/mongodb.client";
import { CharacterMongoStore } from "./character.mongo.store";

export function useMongoStore<T extends new (...args: any[]) => any>(Store: T) {
  let module: TestingModule;
  let store: InstanceType<T>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
      { provide: "TestedStore", useClass: Store },
      {
        provide: "MongoDbClient",
        useFactory: async () => {
          const client = new MongoDbClient()
          await client.init("9000", "test")
          return client
        },
      },
    ]})
    .compile();
    store = module.get("TestedStore");
    module.enableShutdownHooks()
    await module.init();
  });

  afterAll(() => {
    module.close()
  });

  return () => store;
}