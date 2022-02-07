// const typeDefs = `
// type Query {
//   room(name: String!): Room
// }

// type Mutation {}
// type Subscription {}

// type Room {
//   name: String!
//   characters: [Character]!
// }

// type Character {
//   name: String!
//   owner: String!
//   pseudo: String!
// }
// `;

// const resolvers = {
//   Query: {
//     async room(name: string) {
//       const room = await this.roomStore.load(name);
//       return { name: room.name };
//     },
//   },
//   Mutation: {},
//   Subscription: {},
//   Room: {
//     characters(parent: { name: string }) {
//       // resolved field
//       const characters = this.characterStore.load(parent.name);
//       return characters.map((c) => ({ name: c.name, owner: c.owner }));
//     },
//   },
//   Character: {
//     pseudo(parent: { name: string; owner: string }) {
//       // resolved field
//       return parent.name.substring(0, 3);
//     },
//   },
// };

// const schema = craftSchema(typedef, resolvers);

// const graphql = new ApolloGraphqlServer(schema);

// app.use("/graphql", grahpql);

// const query = `
// query GetRoomates {
//   room(name: "roomA"){
//     name
//     characters {
//       name
//       owner
//     }
//   }
// }
// `;

// const response = {
//   errors: null,
//   data: {
//     room: {
//       name: "roomA",
//       characters: [{ name: "Jojo", owner: "Atalykis" }],
//     },
//   },
// };

// @ResolveField(() => [CharacterType])
// characters(@Parent() room: RoomType){
//   const characterIdentities = await this.getCharactersInRoomHandler(room.name)
//   return Promise.all(characterIdentities.map(id => this.characterStore.load(id))
// }

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

//
//  query { cats { name } }
//  mutation { create { name } }
//

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
