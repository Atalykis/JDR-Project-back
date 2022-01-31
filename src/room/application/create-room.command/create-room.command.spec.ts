import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotCreateRoomWithAlreadyTakenNameError, CreateRoomCommand, CreateRoomHandler } from "./create-room.command";

describe("CreateRoomCommand", () => {
  it("should allow a user to create a new room", () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);

    handler.handle(command);

    const room = roomStore.load("room");
    expect(room).toBeDefined();
    expect(room!.gm).toBe("Gm");
  });

  it("should return the name of the created room", () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);

    const name = handler.handle(command);

    expect(name).toBe("room");
  });

  it("should not allow a user to create two room with same name", () => {
    const command: CreateRoomCommand = { name: "room", gm: "Gm", adventure: "GreatEscape" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new CreateRoomHandler(roomStore);
    const existing = new Room("room", "Gm", "GreatEscape");
    roomStore.add(existing);

    expect(() => handler.handle(command)).toThrow(CannotCreateRoomWithAlreadyTakenNameError);
  });
});
