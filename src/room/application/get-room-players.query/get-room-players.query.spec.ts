import { CharacterIdentity } from "../../../character/domain/character";
import { Room } from "../../domain/room";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { RoomStore } from "../room.store";
import { CannotGetPlayersOfNonExistingRoom, GetRoomPlayersHandler, GetRoomPlayersQuery } from "./get-room-players.query";

describe("GetRoomPlayersQuery", () => {
  it("should return all players of a room", async () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomPlayersQuery = { room: "palais" };
    const handler = new GetRoomPlayersHandler(roomStore);
    const room = new Room("palais", "Gm", "GreatEscape");
    await roomStore.add(room);
    room.join("Cyril", new CharacterIdentity("Jojoo", "Cyril", "GreatEscape"));
    room.join("Nico", new CharacterIdentity("oojoJ", "Nico", "GreatEscape"));

    const response = await handler.handle(query);

    expect(response).toEqual(["Cyril", "Nico"]);
  });

  it("should not allow to retrieve players of an non existing room", async () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomPlayersQuery = { room: "palais" };
    const handler = new GetRoomPlayersHandler(roomStore);

    await expect(() => handler.handle(query)).rejects.toThrow(CannotGetPlayersOfNonExistingRoom);
  });
});
