import { Room } from "../domain/room";
import { RoomStore } from "../infrastructure/store/room.store";
import { RoomStoreInMemory } from "../infrastructure/store/room.store.in-memory";
import { CannotCreateRoomWithAlreadyTakenNameError, CreateRoomCommand, CreateRoomHandler } from "./create-room.command";

describe("CreateRoomCommand", () => {
  it("should allow a user to create a new room", () => {
    const command: CreateRoomCommand = { name: "room", mj: "Mj", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);

    handler.handle(command);

    const room = roomStore.load("room");
    expect(room).toBeDefined();
    expect(room!.mj).toBe("Mj");
  });

  it("should return the name of the created room", () => {
    const command: CreateRoomCommand = { name: "room", mj: "Mj", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);

    const name = handler.handle(command);

    expect(name).toBe("room");
  });

  it("should not allow a user to create two room with same name", () => {
    const command: CreateRoomCommand = { name: "room", mj: "Mj", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);
    const existing = new Room("room", "Mj", "GreatEscape");
    roomStore.add(existing);

    expect(() => handler.handle(command)).toThrow(CannotCreateRoomWithAlreadyTakenNameError);
  });
});
