import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { GraphQLModule, Resolver, Query, Mutation, ObjectType, Field, ResolveField, Parent } from "@nestjs/graphql";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";
import { CharacterModule } from "./character/character.module";
import { BackendModule } from "./backend.module";

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.enableCors({ origin: "*" });
  app.listen(3000);
}

bootstrap();
