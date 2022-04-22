import { CharacterFixtures } from "../../../character/domain/character.builder";
import { RoomFixtures } from "../../domain/room-builder";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { AddCharacterCommandHandler } from "./add-character.command";

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
});
