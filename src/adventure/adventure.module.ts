import { Module } from "@nestjs/common";
import { UserModule } from "../user/infrastructure/user.module";
import { AdventureStore } from "./application/adventure.store";
import { CreateAdventureHandler } from "./application/create-adventure.command/create-adventure.command";
import { GetAdventureQueryHandler } from "./application/get-adventure.query/get-adventure.query";
import { GetAdventuresQueryHandler } from "./application/get-adventures-query/get-adventures.query";
import { AdventureStoreInMemory } from "./infrastructure/adventure.store.in-memory";
import { AdventureResolver } from "./infrastructure/graphql/adventure.resolver";

@Module({
  imports: [UserModule],
  providers: [
    { provide: "AdventureStore", useClass: AdventureStoreInMemory },
    {
      provide: GetAdventureQueryHandler,
      useFactory: (adventureStore: AdventureStore) => new GetAdventureQueryHandler(adventureStore),
      inject: ["AdventureStore"],
    },
    {
      provide: GetAdventuresQueryHandler,
      useFactory: (adventureStore: AdventureStore) => new GetAdventuresQueryHandler(adventureStore),
      inject: ["AdventureStore"],
    },
    {
      provide: CreateAdventureHandler,
      useFactory: (adventureStore: AdventureStore) => new CreateAdventureHandler(adventureStore),
      inject: ["AdventureStore"],
    },
    AdventureResolver,
  ],
})
export class AdventureModule {}
