import { Module } from "@nestjs/common";
import { UserModule } from "../user/infrastructure/user.module";
import { CharacterStore } from "./application/character.store";
import { CreateCharacterHandler } from "./application/create-character.command/create-character.comand";
import { GetCharacterHandler } from "./application/get-character.query /get-character.query";
import { GetCharactersHandler } from "./application/get-characters.query/get-characters.query";
import { CharacterStoreInMemory } from "./infrastructure/store/character.store.in-memory";
import { CharacterResolver } from "./infrastructure/graphql/character.resolver";
import { CharacterController } from "./infrastructure/http/character.controller";
import { CharacterMongooseStore, MongooseCharacterProvider } from "./infrastructure/store/character.mongoose.store/character.mongoose.store";
import { CharacterMongoStore } from "./infrastructure/store/character.mongo.store/character.mongo.store";
import { MongoDbClient } from "./infrastructure/mongodb/mongodb.client";

@Module({
  imports: [UserModule],
  controllers: [CharacterController],
  providers: [
    { provide: "CharacterStore", useClass: CharacterStoreInMemory },
    {
      provide: CreateCharacterHandler,
      useFactory: (characterStore: CharacterStore) => new CreateCharacterHandler(characterStore),
      inject: ["CharacterStore"],
    },
    {
      provide: GetCharacterHandler,
      useFactory: (characterStore: CharacterStore) => new GetCharacterHandler(characterStore),
      inject: ["CharacterStore"],
    },
    {
      provide: GetCharactersHandler,
      useFactory: (characterStore: CharacterStore) => new GetCharactersHandler(characterStore),
      inject: ["CharacterStore"],
    },

    CharacterResolver,
    {
      provide: "MongoDbClient",
      useFactory: async () => {
        const client = new MongoDbClient()
        await client.init("9000", "test")
        return client
      }
    }
  ],
  exports: ["CharacterStore"],
})
export class CharacterModule {}
