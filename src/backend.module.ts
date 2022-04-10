import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { GraphQLModule, Resolver, Query, Mutation, ObjectType, Field, ResolveField, Parent } from "@nestjs/graphql";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";
import { CharacterModule } from "./character/character.module";
import { BoardModule } from "./board/infrastructure/board.module";
import { AdventureModule } from "./adventure/adventure.module";

@Module({
  imports: [
    AdventureModule,
    UserModule,
    RoomModule,
    CharacterModule,
    BoardModule,
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
