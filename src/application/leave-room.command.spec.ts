import { Room } from "../domain/room";
import { RoomStoreInMemory } from "../infrastructure/room.store.in-memory";
import { CannotLeaveUnjoinedRoomError, LeaveRoomCommand, LeaveRoomHandler } from "./leave-room.command";
import { RoomStore } from "./room.store";

describe("LeaveRoomCommand", () => {
  it("should allow a user to leave a room", () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("hall");
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
    const room = new Room("hall");
    roomStore.add(room);
    const handler = new LeaveRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotLeaveUnjoinedRoomError);
  });
});
