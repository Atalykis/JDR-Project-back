import { User } from "../../user/domain/user";
import { Room } from "../domain/room";
import { RoomStoreInMemory } from "../infrastructure/store/room.store.in-memory";
import {
  KickPlayerHandler,
  KickPlayerCommand,
  CannotKickPlayerFromNonExistingRoomError,
  CannotKickPlayerOutsideARoomError,
  CannotKickPlayerIfNotMjError,
} from "./kick-player.command";

describe("KickPlayerCommand", () => {
  const roomStore = new RoomStoreInMemory();
  const handler = new KickPlayerHandler(roomStore);

  beforeEach(() => {
    roomStore.clear();
  });

  it("should remove a player from the room", () => {
    const room = new Room("aRoom", "mj", "GreatEscape");
    const player = new User("Cyril", "password");
    room.join(player.username);
    roomStore.add(room);

    const command: KickPlayerCommand = { room: room.name, player: player.username, originator: "mj" };

    handler.handle(command);

    const roomAfter = roomStore.load("aRoom");
    expect(roomAfter!.has(player.username)).toBe(false);
  });

  it("should fail if the room does not exist", () => {
    const command: KickPlayerCommand = { room: "nonExistingRoom", player: "Cyril", originator: "mj" };

    expect(() => handler.handle(command)).toThrow(CannotKickPlayerFromNonExistingRoomError);
  });

  it("should fail if the player is not in the room", () => {
    const room = new Room("aRoom", "mj", "GreatEscape");
    const player = new User("Cyril", "password");
    roomStore.add(room);

    const command: KickPlayerCommand = { room: room.name, player: player.username, originator: "mj" };

    expect(() => handler.handle(command)).toThrow(CannotKickPlayerOutsideARoomError);
  });

  it("should fail if the originator of the kick is not the mj", () => {
    const room = new Room("aRoom", "mj", "GreatEscape");
    const player = new User("Cyril", "password");
    room.join(player.username);
    roomStore.add(room);

    const command: KickPlayerCommand = { room: room.name, player: player.username, originator: "notMj" };

    expect(() => handler.handle(command)).toThrow(CannotKickPlayerIfNotMjError);
  });
});
