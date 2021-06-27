import { Room } from "../domain/room";
import { RoomStore } from "../infrastructure/store/room.store";
import { RoomStoreInMemory } from "../infrastructure/store/room.store.in-memory";
import { CannotGetPlayersOfNonExistingRoom, GetRoomPlayersHandler, GetRoomPlayersQuery } from "./get-room-players.query";

describe("GetRoomPlayersQuery", () => {
  it("should return all players of a room", () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomPlayersQuery = { room: "palais" };
    const handler = new GetRoomPlayersHandler(roomStore);
    const room = new Room("palais", "Mj");
    roomStore.add(room);
    room.join("Cyril");
    room.join("Nico");

    const response = handler.handle(query);

    expect(response).toEqual(["Cyril", "Nico"]);
  });

  it("should not allow to retrieve players of an non existing room", () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomPlayersQuery = { room: "palais" };
    const handler = new GetRoomPlayersHandler(roomStore);

    expect(() => handler.handle(query)).toThrow(CannotGetPlayersOfNonExistingRoom);
  });
});
