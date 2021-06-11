import { Room } from "../domain/room";
import { RoomStoreInMemory } from "../infrastructure/room.store.in-memory";
import { CannotCreateRoomWithAlreadyTakenNameError, CreateRoomCommand, CreateRoomHandler } from "./create-room.command";
import { RoomStore } from "./room.store";

describe("CreateRoomCommand", () => {
  it("should allow a user to create a new room", () => {
    const command: CreateRoomCommand = { name: "room" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);

    handler.handle(command);

    const room = roomStore.load("room");
    expect(room).toBeDefined();
  });

  it("should not allow a user to create two room with same name", () => {
    const command: CreateRoomCommand = { name: "room" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);
    const room = new Room("room");
    roomStore.add(room);

    expect(() => handler.handle(command)).toThrow(CannotCreateRoomWithAlreadyTakenNameError);
  });
});
