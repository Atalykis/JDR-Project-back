import { Module } from "@nestjs/common";
import { UserModule } from "../user/infrastructure/user.module";
import { CharacterStore } from "./application/character.store";
import { CreateCharacterHandler } from "./application/create-character.command/create-character.comand";
import { GetCharactersHandler } from "./application/get-characters.query/get-characters.query";
import { CharacterStoreInMemory } from "./infrastructure/character.store.in-memory";
import { CharacterController } from "./infrastructure/http/character.controller";

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
      provide: GetCharactersHandler,
      useFactory: (characterStore: CharacterStore) => new GetCharactersHandler(characterStore),
      inject: ["CharacterStore"],
    },
  ],
})
export class CharacterModule {}
