import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { makeGetAuthenticatedToken } from "../../../user/test/authenticated-token";
import { BoardStore } from "../../application/board.store";
import { InMemoryBoardStore } from "../board-store-in-memory";
import { BoardModule } from "../board.module";
import { io } from "socket.io-client";
import { Server } from "socket.io";
import { BackendModule } from "../../../backend.module";
import { LineFixtures } from "../../domain/line.builder";
import { EventBus } from "../../application/event-bus";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { gql } from "apollo-server-express";
import { BoardBuilder } from "../../domain/board.builder";
import { DrawLineCommandHandler } from "../../application/draw-line.command/draw-line.command";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createConnectedWSClientFor(token: string) {
  const client = io("http://localhost:8000", {
    extraHeaders: {
      Authorization: token,
    },
  });
  await new Promise<void>((r, reject) => {
    client.on("connect", () => r());
    setTimeout(() => reject(new Error("Timed out waiting for websocket connection")), 1000);
  });
  return client;
}

describe("BoardGateway", () => {
  let app: INestApplication;
  const store = new InMemoryBoardStore();

  let getAuthenticatedTokenFor: ReturnType<typeof makeGetAuthenticatedToken>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [BackendModule] })
      .overrideProvider(BoardStore)
      .useValue(store)
      .compile();
    getAuthenticatedTokenFor = makeGetAuthenticatedToken(module);

    app = module.createNestApplication();
    await app.listen(8000);
  });

  afterAll(async () => {
    await app.close();
  });

  it("should allow any client to receive lines other client lines", async () => {
    const attachFirstMessageCatcher = (client: any) =>
      new Promise((resolve) => {
        client.on("LineAdded", (message: any) => resolve(message));
      });

    const tokenA = getAuthenticatedTokenFor("Atalykis");
    const tokenB = getAuthenticatedTokenFor("Aetherall");

    const clientA = await createConnectedWSClientFor(tokenA);
    const clientB = await createConnectedWSClientFor(tokenB);

    setTimeout(() => clientA.close(), 1000);
    setTimeout(() => clientB.close(), 1000);

    const clientAFirstMessage = attachFirstMessageCatcher(clientA);
    const clientBFirstMessage = attachFirstMessageCatcher(clientB);

    await app.get(DrawLineCommandHandler).handle({
      roomName: "TheBizarreRoom",
      line: LineFixtures.blueDash,
      author: "Atalykis",
    });

    await app.get(DrawLineCommandHandler).handle({
      roomName: "TheBizarreRoom",
      line: LineFixtures.greenSquare,
      author: "Aetherall",
    });

    await wait(500);

    expect(await clientBFirstMessage).toEqual(LineFixtures.blueDash.serialize());
    expect(await clientAFirstMessage).toEqual(LineFixtures.greenSquare.serialize());
  });
});
