import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotLeaveUnexistingRoomError, CannotLeaveUnjoinedRoomError, LeaveRoomCommand, LeaveRoomHandler } from "./leave-room.command";

describe("LeaveRoomCommand", () => {
  it("should allow a user to leave a room", () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("hall", "mj", "GreatEscape");
    roomStore.add(room);
    room.join("Cyril");

    expect(room.members).toEqual(["Cyril"]);
    const handler = new LeaveRoomHandler(roomStore);

    handler.handle(command);
    expect(room.members).toEqual([]);
  });

  it("should not allow a user to leave a room they're not in", () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("hall", "mj", "GreatEscape");
    roomStore.add(room);
    const handler = new LeaveRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotLeaveUnjoinedRoomError);
  });

  it("should not allow a user to leave an unexisting room", () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new LeaveRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotLeaveUnexistingRoomError);
  });
});
