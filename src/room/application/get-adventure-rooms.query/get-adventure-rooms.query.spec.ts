import { RoomFixtures } from "../../domain/room-builder";
import { RoomStoreInMemory } from "../../infrastructure/store/room.store.in-memory";
import { GetAdventureRoomsQuery, GetAdventureRoomsQueryHandler } from "./get-adventure-rooms.query";

describe("GetAdventureRoomsQuery", () => {
  it("should retrieve a list of rooms contained in an adventure", async () => {
    const roomStore = new RoomStoreInMemory();
    const query: GetAdventureRoomsQuery = { adventure: "TheGreatEscape" };

    const greatRoom = RoomFixtures.greatRoom;
    const escapeRoom = RoomFixtures.escapeRoom;

    await roomStore.add(greatRoom);
    await roomStore.add(escapeRoom);

    const handler = new GetAdventureRoomsQueryHandler(roomStore);
    const rooms = await handler.handle(query);

    expect(rooms).toEqual([
      {
        name: greatRoom.name,
        gm: greatRoom.gm,
        adventure: greatRoom.adventure,
      },
      {
        name: escapeRoom.name,
        gm: escapeRoom.gm,
        adventure: escapeRoom.adventure,
      },
    ]);
  });
});
