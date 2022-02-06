import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { GraphQLModule, Resolver, Query, Mutation, ObjectType, Field, ResolveField, Parent } from "@nestjs/graphql";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";
import { CharacterModule } from "./character/character.module";

@Module({
  imports: [
    UserModule,
    RoomModule,
    CharacterModule,
    GraphQLModule.forRoot({
      autoSchemaFile: __dirname + "/schema.gql",
    }),
  ],
})
export class BackendModule {}