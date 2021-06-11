import { Room } from "../domain/room";
import { RoomStoreInMemory } from "../infrastructure/room.store.in-memory";
import { CannotGetMembersOfNonExistingRoom, GetRoomMembersHandler, GetRoomMembersQuery } from "./get-room-members.query";
import { RoomStore } from "./room.store";

describe("GetRoomMembersQuery", () => {
  it("should return all members of a room", () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomMembersQuery = { room: "palais" };
    const handler = new GetRoomMembersHandler(roomStore);
    const room = new Room("palais");
    roomStore.add(room);
    room.join("Cyril");
    room.join("Nico");

    const response = handler.handle(query);

    expect(response).toEqual(["Cyril", "Nico"]);
  });

  it("should not allow to withdraw memebers of an non existing room", () => {
    const roomStore: RoomStore = new RoomStoreInMemory();
    const query: GetRoomMembersQuery = { room: "palais" };
    const handler = new GetRoomMembersHandler(roomStore);

    expect(() => handler.handle(query)).toThrow(CannotGetMembersOfNonExistingRoom);
  });
});
