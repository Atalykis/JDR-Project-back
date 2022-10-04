import { Module } from "@nestjs/common";
import { UserModule } from "../../user/infrastructure/user.module";
import { CreateUniverseCommandHandler } from "../application/create-universe.command/create-universe.command";
import { GetOwnedUniversesQueryHandler } from "../application/get-owned-universes.query/get-owned-universes.query";
import { GetUniverseQueryHandler } from "../application/get-universe.query/get-universe.query";
import { UniverseStore } from "../application/universe.store";
import { UniverseResolver } from "./graphql/universe.resolver";
import { UniverseStoreInMemory } from "./universe.store.in-memory";

@Module({
  imports: [UserModule],
  providers: [
    { provide: "UniverseStore", useClass: UniverseStoreInMemory },
    {
      provide: CreateUniverseCommandHandler,
      useFactory: (universeStore: UniverseStore) => new CreateUniverseCommandHandler(universeStore),
      inject: ["UniverseStore"],
    },
    {
      provide: GetUniverseQueryHandler,
      useFactory: (universeStore: UniverseStore) => new GetUniverseQueryHandler(universeStore),
      inject: ["UniverseStore"],
    },
    {
      provide: GetOwnedUniversesQueryHandler,
      useFactory: (universeStore: UniverseStore) => new GetOwnedUniversesQueryHandler(universeStore),
      inject: ["UniverseStore"],
    },
    UniverseResolver,
  ],
})
export class UniverseModule {}
