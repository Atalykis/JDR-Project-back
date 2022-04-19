import { RoomStore } from "../room.store";

export interface GetAdventureRoomsQuery {
  adventure: string;
}

export class GetAdventureRoomsQueryHandler {
  constructor(private readonly roomStore: RoomStore) {}

  async handle(query: GetAdventureRoomsQuery) {
    const rooms = await this.roomStore.loadManyFromAdventure(query.adventure);
    return rooms.map((room) => {
      return {
        name: room.name,
        gm: room.gm,
        adventure: room.adventure,
      };
    });
  }
}
