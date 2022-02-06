import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { GraphQLModule, Resolver, Query, Mutation, ObjectType, Field, ResolveField, Parent } from "@nestjs/graphql";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";
import { CharacterModule } from "./character/character.module";
import { BackendModule } from "./backend.module";

// const res = {
//   Query: {
//     cats() {},
//   },
//   Mutation: {},
//   Subscription: {},
//   Cat: {},
// };

// @ObjectType("Cat") // type Cat { name: Float! }
// class CatType {
//   @Field()
//   name: number;
// }

// /**
//  * query { cats { name } }
//  * mutation { create { name } }
//  */

// @Resolver(() => CatType)
// class CatResolver {
//   store: { name: number }[] = [{ name: 1 }, { name: 2 }];

//   @ResolveField(() => Number)
//   doubled(@Parent() cat: CatType) {
//     return cat.name * 2;
//   }

//   @Mutation(() => [CatType]) // type Mutation { create: Boolean  }
//   create() {
//     this.store.push({ name: Math.random() });
//     return this.store;
//   }

//   @Query(() => [CatType])
//   cats() {
//     return this.store;
//   }
// }

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.enableCors({ origin: "*" });
  app.listen(3000);
}

bootstrap();
