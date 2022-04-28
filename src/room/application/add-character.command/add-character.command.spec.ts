import { CharacterFixtures } from "../../../character/domain/character.builder";
import { RoomFixtures } from "../../domain/room-builder";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { AddCharacterCommandHandler, CannotAddCharacterInsideNonExistingRoom } from "./add-character.command";

describe("AddCharacterCommand", () => {
  const roomStore = new RoomStoreInMemory();

  it("should allow a user to add a character to a room", async () => {
    const room = RoomFixtures.greatRoom;
    const character = CharacterFixtures.Dio;
    const command = { room: room.name, character: character.identity };

    await roomStore.add(room);

    const handler = new AddCharacterCommandHandler(roomStore);

    await handler.handle(command);

    expect(room.adventurers).toEqual([character.identity]);
  });

  it("should not allow to add character inside non existing room", async () => {
    const character = CharacterFixtures.Dio;
    const command = { room: "escapeRoom", character: character.identity };
    const handler = new AddCharacterCommandHandler(roomStore);

    await expect(() => handler.handle(command)).rejects.toThrow(CannotAddCharacterInsideNonExistingRoom);
  });
});
