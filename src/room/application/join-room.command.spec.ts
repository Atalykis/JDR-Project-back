import { Room } from "../domain/room";
import { RoomStore } from "../infrastructure/store/room.store";
import { RoomStoreInMemory } from "../infrastructure/store/room.store.in-memory";
import { CannotJoinAleadyJoinedRoomError, CannotJoinUnexistingRoomError, JoinRoomCommand, JoinRoomHandler } from "./join-room.command";

describe("JoinRoomCommand", () => {
  it("should allow a user to join a room", () => {
    const command: JoinRoomCommand = { user: "Cyril", room: "everyone" };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("everyone", "mj");
    roomStore.add(room);

    const handler = new JoinRoomHandler(roomStore);

    handler.handle(command);

    expect(room.members).toEqual(["Cyril"]);
  });

  it("should not allow an user to join a room he already joined", () => {
    const command: JoinRoomCommand = { user: "Cyril", room: "noone" };
    const roomStore = new RoomStoreInMemory();
    const room = new Room("noone", "mj");
    roomStore.add(room);
    room.join("Cyril");

    const handler = new JoinRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotJoinAleadyJoinedRoomError);
  });

  it("should not allow an user to join an unexisting room ", () => {
    const command: JoinRoomCommand = { user: "Cyril", room: "noone" };
    const roomStore = new RoomStoreInMemory();

    const handler = new JoinRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotJoinUnexistingRoomError);
  });
});