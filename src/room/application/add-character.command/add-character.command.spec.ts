import { BoardBuilder } from "../../../board/domain/board.builder";
import { TokenFixture } from "../../../board/domain/token.builder";
import { InMemoryBoardStore } from "../../../board/infrastructure/board-store-in-memory";
import { CharacterFixtures } from "../../../character/domain/character.builder";
import { RoomFixtures } from "../../domain/room-builder";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { AddCharacterCommandHandler, CannotAddCharacterInsideNonExistingRoom } from "./add-character.command";

describe("AddCharacterCommand", () => {

  const roomStore = new RoomStoreInMemory();
  const boardStore = new InMemoryBoardStore();

  it("should allow a user to add a character to a room", async () => {
    const room = RoomFixtures.greatRoom;
    const character = CharacterFixtures.Dio;
    const command = { room: room.name, character: character.identity };

    await roomStore.add(room);

    const handler = new AddCharacterCommandHandler(roomStore, boardStore);

    await handler.handle(command);
    const loaded = await roomStore.load("greatRoom")

    expect(loaded!.adventurers).toEqual([character.identity]);
  });

  it("should not allow to add character inside non existing room", async () => {
    const character = CharacterFixtures.Dio;
    const command = { room: "escapeRoom", character: character.identity };
    const handler = new AddCharacterCommandHandler(roomStore, boardStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotAddCharacterInsideNonExistingRoom);
  });

  it("should create a token for the added character", async () => {
    const room = RoomFixtures.greatRoom;
    const board = new BoardBuilder().withRoomName("greatRoom").build()
    const character = CharacterFixtures.Jojo;
    const command = { room: room.name, character: character.identity };

    await boardStore.save(board)
    await roomStore.add(room);

    const handler = new AddCharacterCommandHandler(roomStore, boardStore);

    await handler.handle(command);
    const loadedRoom = await roomStore.load("greatRoom")
    const loadedBoard = await boardStore.load("greatRoom")

    expect(loadedRoom!.adventurers.find((id) => id.equals(character.identity))).toEqual(character.identity);
    expect(loadedBoard!.tokens.find((ownedToken) => ownedToken.token.identity.equals(character.identity))).toEqual({owner: "Atalykis", token: TokenFixture.basic50})
  })
});
