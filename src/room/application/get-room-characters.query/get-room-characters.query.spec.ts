import { CharacterIdentity } from "../../../character/domain/character";
import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { GetRoomCharactersHandler, GetRoomCharactersQuery } from "./get-room-characters.query";

describe("GetRoomCharactersQuery", () => {
  it("should return all characters of a room", () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomCharactersQuery = { room: "palais" };
    const handler = new GetRoomCharactersHandler(roomStore);
    const room = new Room("palais", "Gm", "GreatEscape");
    roomStore.add(room);
    room.join("Cyril", new CharacterIdentity("Jojoo", "Cyril", "GreatEscape"));
    room.join("Nico", new CharacterIdentity("oojoJ", "Nico", "GreatEscape"));

    const response = handler.handle(query);

    expect(response).toEqual([new CharacterIdentity("Jojoo", "Cyril", "GreatEscape"), new CharacterIdentity("oojoJ", "Nico", "GreatEscape")]);
  });
});
