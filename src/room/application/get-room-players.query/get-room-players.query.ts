import { RoomStore } from "../room.store";

export interface GetRoomPlayersQuery {
  room: string;
}

export class GetRoomPlayersHandler {
  constructor(private readonly roomStore: RoomStore) {}

  handle(query: GetRoomPlayersQuery) {
    const room = this.roomStore.load(query.room);
    if (!room) {
      throw new CannotGetPlayersOfNonExistingRoom(query.room);
    }
    return room.members;
  }
}

export class CannotGetPlayersOfNonExistingRoom extends Error {
  constructor(name: string) {
    super(`Could not get players for the not existing room ${name}`);
  }
}
