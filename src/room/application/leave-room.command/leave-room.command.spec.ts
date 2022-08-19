import { CharacterIdentity } from "../../../character/domain/character";
import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotLeaveUnexistingRoomError, CannotLeaveUnjoinedRoomError, LeaveRoomCommand, LeaveRoomHandler } from "./leave-room.command";

describe("LeaveRoomCommand", () => {
  it("should allow a user to leave a room", async () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("hall", "gm", "GreatEscape");
    await roomStore.add(room);
    room.join("Cyril");

    expect(room.members).toEqual(["Cyril"]);
    const handler = new LeaveRoomHandler(roomStore);

    await handler.handle(command);
    expect(room.members).toEqual([]);
  });

  it("should not allow a user to leave a room they're not in", async () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("hall", "gm", "GreatEscape");
    await roomStore.add(room);
    const handler = new LeaveRoomHandler(roomStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotLeaveUnjoinedRoomError);
  });

  it("should not allow a user to leave an unexisting room", async () => {
    const command: LeaveRoomCommand = { user: "Cyril", room: "hall" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const handler = new LeaveRoomHandler(roomStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotLeaveUnexistingRoomError);
  });
});
