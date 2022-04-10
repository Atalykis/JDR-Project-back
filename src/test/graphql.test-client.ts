import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { DocumentNode, print } from "graphql";
import request from "supertest";
import { makeGetAuthenticatedToken } from "../user/test/authenticated-token";

export class GraphqlTestClient {
  token?: string;
  private readonly getAuthenticatedToken: (username: string) => string;

  constructor(public app: INestApplication) {
    this.getAuthenticatedToken = makeGetAuthenticatedToken(this.app);
  }

  as(username: string) {
    this.token = this.getAuthenticatedToken(username);
  }

  unauthenticated() {
    delete this.token;
  }

  async execute(query: DocumentNode, variables: any = {}) {
    // http
    // subs => ws

    // Apollo Link HTTP
    // Apollo Link WebSocket

    // Apollo split (query&mutation -> http, subscription -> ws)

    /**
     * requestrequest
     * 
     * const httpLink = new HttpLink({
        uri: 'http://localhost/api/graphql',
      });

      const wsLink = new WebSocketLink({
        uri: `ws://localhost/api/graphql`,
        options: {
          reconnect: true,
        },
      });

      const link = split(
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      );

      const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
      });
     */

    // const headers = new Headers();
    // headers.append("Authorization", this.token!);

    // return this.app.get(GraphQLModule).apolloServer.executeOperation(
    //   {
    //     query,
    //     variables,
    //     // http: {
    //     //   headers,
    //     // } as any,
    //   },
    //   {}
    // );

    const { body } = await request(this.app.getHttpServer())
      .post("/graphql")
      .set("Authorization", this.token || "")
      .send({ query: print(query), variables });
    return body;
  }
}
