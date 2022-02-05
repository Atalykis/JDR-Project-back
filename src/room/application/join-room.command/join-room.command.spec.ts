import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotJoinAleadyJoinedRoomError, CannotJoinUnexistingRoomError, JoinRoomCommand, JoinRoomHandler } from "./join-room.command";

describe("JoinRoomCommand", () => {
  it("should allow a user to join a room", () => {
    const command: JoinRoomCommand = {
      user: "Cyril",
      room: "everyone",
      character: { name: "Jojoo", owner: "Cyril", description: "description", adventure: "GreatEscape" },
    };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("everyone", "gm", "GreatEscape");
    roomStore.add(room);

    const handler = new JoinRoomHandler(roomStore);

    handler.handle(command);

    expect(room.members).toEqual(["Cyril"]);
    expect(room.adventurers).toEqual([{ name: "Jojoo", owner: "Cyril", adventure: "GreatEscape", description: "description" }]);
  });

  it("should not allow an user to join a room he already joined", () => {
    const command: JoinRoomCommand = {
      user: "Cyril",
      room: "noone",
      character: { name: "Jojoo", owner: "Cyril", description: "description", adventure: "GreatEscape" },
    };
    const roomStore = new RoomStoreInMemory();
    const room = new Room("noone", "gm", "GreatEscape");
    roomStore.add(room);
    room.join("Cyril", { name: "Jojoo", owner: "Cyril", description: "description", adventure: "GreatEscape" });

    const handler = new JoinRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotJoinAleadyJoinedRoomError);
  });

  it("should not allow an user to join an unexisting room ", () => {
    const command: JoinRoomCommand = {
      user: "Cyril",
      room: "noone",
      character: { name: "Jojoo", owner: "Cyril", description: "description", adventure: "noone" },
    };
    const roomStore = new RoomStoreInMemory();

    const handler = new JoinRoomHandler(roomStore);

    expect(() => handler.handle(command)).toThrow(CannotJoinUnexistingRoomError);
  });
});
