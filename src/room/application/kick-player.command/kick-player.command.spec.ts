import { CharacterIdentity } from "../../../character/domain/character";
import { User } from "../../../user/domain/user";
import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import {
  KickPlayerHandler,
  KickPlayerCommand,
  CannotKickPlayerFromNonExistingRoomError,
  CannotKickPlayerOutsideARoomError,
  CannotKickPlayerIfNotGmError,
} from "./kick-player.command";

describe("KickPlayerCommand", () => {
  const roomStore = new RoomStoreInMemory();
  const handler = new KickPlayerHandler(roomStore);

  beforeEach(() => {
    roomStore.clear();
  });

  it("should remove a player from the room", async () => {
    const room = new Room("aRoom", "gm", "GreatEscape");
    const player = new User("Cyril", "password");
    room.join(player.username, new CharacterIdentity("Jojoo", "Cyril", "GreatEscape"));
    await roomStore.add(room);

    const command: KickPlayerCommand = { room: room.name, player: player.username, originator: "gm" };

    await handler.handle(command);

    const roomAfter = await roomStore.load("aRoom");
    expect(roomAfter!.has(player.username)).toBe(false);
  });

  it("should fail if the room does not exist", async () => {
    const command: KickPlayerCommand = { room: "nonExistingRoom", player: "Cyril", originator: "gm" };

    await expect(() => handler.handle(command)).rejects.toThrow(CannotKickPlayerFromNonExistingRoomError);
  });

  it("should fail if the player is not in the room", async () => {
    const room = new Room("aRoom", "gm", "GreatEscape");
    const player = new User("Cyril", "password");
    await roomStore.add(room);

    const command: KickPlayerCommand = { room: room.name, player: player.username, originator: "gm" };

    await expect(() => handler.handle(command)).rejects.toThrow(CannotKickPlayerOutsideARoomError);
  });

  it("should fail if the originator of the kick is not the gm", async () => {
    const room = new Room("aRoom", "gm", "GreatEscape");
    const player = new User("Cyril", "password");
    room.join(player.username, new CharacterIdentity("Jojoo", "Cyril", "GreatEscape"));
    await roomStore.add(room);

    const command: KickPlayerCommand = { room: room.name, player: player.username, originator: "notGm" };

    await expect(() => handler.handle(command)).rejects.toThrow(CannotKickPlayerIfNotGmError);
  });
});
