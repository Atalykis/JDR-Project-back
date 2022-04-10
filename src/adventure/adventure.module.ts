import { Module } from "@nestjs/common";
import { UserModule } from "../user/infrastructure/user.module";
import { AdventureStore } from "./application/adventure.store";
import { GetAdventuresQueryHandler } from "./application/get-adventures-query/get-adventures.query";
import { AdventureStoreInMemory } from "./infrastructure/adventure.store.in-memory";
import { AdventureResolver } from "./infrastructure/graphql/adventure.resolver";

@Module({
  imports: [UserModule],
  providers: [
    { provide: "AdventureStore", useClass: AdventureStoreInMemory },
    {
      provide: GetAdventuresQueryHandler,
      useFactory: (adventureStore: AdventureStore) => new GetAdventuresQueryHandler(adventureStore),
      inject: ["AdventureStore"],
    },
    AdventureResolver,
  ],
})
export class AdventureModule {}
