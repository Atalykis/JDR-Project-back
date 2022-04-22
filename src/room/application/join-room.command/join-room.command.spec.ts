import { CharacterIdentity } from "../../../character/domain/character";
import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotJoinAleadyJoinedRoomError, CannotJoinUnexistingRoomError, JoinRoomCommand, JoinRoomHandler } from "./join-room.command";

describe("JoinRoomCommand", () => {
  it("should allow a user to join a room", async () => {
    const command: JoinRoomCommand = {
      user: "Cyril",
      room: "everyone",
    };
    const roomStore: RoomStore = new RoomStoreInMemory();
    const room = new Room("everyone", "gm", "GreatEscape");
    await roomStore.add(room);

    const handler = new JoinRoomHandler(roomStore);

    await handler.handle(command);

    expect(room.members).toEqual(["Cyril"]);
  });

  it("should not allow an user to join a room he already joined", async () => {
    const command: JoinRoomCommand = {
      user: "Cyril",
      room: "noone",
    };
    const roomStore = new RoomStoreInMemory();
    const room = new Room("noone", "gm", "GreatEscape");
    await roomStore.add(room);
    room.join("Cyril");

    const handler = new JoinRoomHandler(roomStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotJoinAleadyJoinedRoomError);
  });

  it("should not allow an user to join an unexisting room ", async () => {
    const command: JoinRoomCommand = {
      user: "Cyril",
      room: "noone",
    };
    const roomStore = new RoomStoreInMemory();

    const handler = new JoinRoomHandler(roomStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotJoinUnexistingRoomError);
  });
});
