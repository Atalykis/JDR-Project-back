import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { Test } from "@nestjs/testing";
import { gql } from "apollo-server-core";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { BoardStore } from "../../application/board.store";
import { BoardBuilder } from "../../domain/board.builder";
import { LineFixtures } from "../../domain/line.builder";
import { InMemoryBoardStore } from "../board-store-in-memory";

describe("BoardResolver", () => {
  let app: INestApplication;
  let graphql: GraphqlTestClient;

  const store = new InMemoryBoardStore();

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider(BoardStore)
      .useValue(store)
      .compile();

    app = module.createNestApplication();
    await app.init();

    graphql = new GraphqlTestClient(app);
    graphql.as("Atalykis");
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Query board", () => {
    const query = gql`
      query GetBoard($roomName: String!) {
        board(roomName: $roomName) {
          roomName
          lines {
            points {
              x
              y
            }
            thickness
            color
          }
        }
      }
    `;

    it("should return the board", async () => {
      const board = new BoardBuilder().withRoomName("room-a").addLineAs("blueDash", "Atalykis").build();

      await store.save(board);

      const result = await graphql.execute(query, { roomName: "room-a" });

      expect(result.errors).toBeUndefined();

      expect(result.data).toEqual({
        board: {
          roomName: board.roomName,
          lines: [LineFixtures.blueDash.serialize()],
        },
      });
    });
  });

  describe("Mutation draw", () => {
    const mutation = gql`
      mutation Draw($roomName: String!, $line: LineInput!) {
        draw(roomName: $roomName, line: $line) {
          roomName
          lines {
            points {
              x
              y
            }
            thickness
            color
          }
        }
      }
    `;

    it("should draw a line", async () => {
      const board = new BoardBuilder().withRoomName("room-a").build();

      await store.save(board);

      const result = await graphql.execute(mutation, {
        roomName: "room-a",
        line: LineFixtures.blueDash.serialize(),
      });

      expect(result.data).toEqual({
        draw: {
          roomName: board.roomName,
          lines: [LineFixtures.blueDash.serialize()],
        },
      });
    });
  });
});
