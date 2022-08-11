import { Module } from "@nestjs/common";
import { UserModule } from "../user/infrastructure/user.module";
import { CharacterStore } from "./application/character.store";
import { CreateCharacterHandler } from "./application/create-character.command/create-character.comand";
import { GetCharacterHandler } from "./application/get-character.query /get-character.query";
import { GetCharactersHandler } from "./application/get-characters.query/get-characters.query";
import { CharacterStoreInMemory } from "./infrastructure/store/character.store.in-memory";
import { CharacterResolver } from "./infrastructure/graphql/character.resolver";
import { CharacterController } from "./infrastructure/http/character.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Character as CharacterModel, CharacterSchema } from "./domain/character.schema";
import { CharacterMongoStore } from "./infrastructure/store/character.mongo.store";

@Module({
  imports: [UserModule, MongooseModule.forFeature([{ name: CharacterModel.name, schema: CharacterSchema }])],
  controllers: [CharacterController],
  providers: [
    { provide: "CharacterStore", useClass: CharacterMongoStore },
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
  ],
  exports: ["CharacterStore"],
})
export class CharacterModule {}
