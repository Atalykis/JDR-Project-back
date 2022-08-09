import { BoardStore } from "../../../board/application/board.store";
import { InMemoryBoardStore } from "../../../board/infrastructure/board-store-in-memory";
import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotCreateRoomWithAlreadyTakenNameError, CreateRoomCommand, CreateRoomHandler } from "./create-room.command";

describe("CreateRoomCommand", () => {
  it("should allow a user to create a new room", async () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const boardStore: BoardStore =  new InMemoryBoardStore();
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore, boardStore);

    await handler.handle(command);

    const room = await roomStore.load("room");
    expect(room).toBeDefined();
    expect(room!.gm).toBe("Gm");
  });

  it("should return the name of the created room", async () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const boardStore: BoardStore =  new InMemoryBoardStore();
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore, boardStore);

    const name = await handler.handle(command);

    expect(name).toBe("room");
  });

  it("should create the board of the created room", async () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const boardStore: BoardStore =  new InMemoryBoardStore();
    const handler = new CreateRoomHandler(roomStore, boardStore);

    const name = await handler.handle(command);
    const loaded = await boardStore.load("room")

    expect(name).toBe("room");
    expect(loaded).toBeDefined()
  });

  it("should not allow a user to create two room with same name", async () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const boardStore: BoardStore =  new InMemoryBoardStore();
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore, boardStore);
    const existing = new Room("room", "Gm", "GreatEscape");
    await roomStore.add(existing);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotCreateRoomWithAlreadyTakenNameError);
  });
});
