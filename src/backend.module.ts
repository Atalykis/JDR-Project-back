import { Module } from "@nestjs/common";
import { GraphQLModule} from "@nestjs/graphql";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";
import { CharacterModule } from "./character/character.module";
import { BoardModule } from "./board/infrastructure/board.module";
import { AdventureModule } from "./adventure/adventure.module";
import { CharacterTemplateModule } from "./character-template/infrastructure/character-template.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UniverseModule } from "./universe/infrastructure/universe.module";

@Module({
  imports: [
    // MongooseModule.forRoot("mongodb://localhost:27017/test"),
    AdventureModule,
    UserModule,
    RoomModule,
    CharacterModule,
    BoardModule,
    CharacterTemplateModule,
    UniverseModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   "graphql-ws": true,
      // },
      autoSchemaFile: __dirname + "/schema.gql",
    }),
  ],
})
export class BackendModule {}
