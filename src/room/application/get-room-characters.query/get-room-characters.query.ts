import { RoomStore } from "../room.store";

export interface GetRoomCharactersQuery {
  room: string;
}

export class GetRoomCharactersHandler {
  constructor(private readonly roomStore: RoomStore) {}

  async handle(query: GetRoomCharactersQuery) {
    const room = await this.roomStore.load(query.room);
    if (!room) {
      throw new CannotGetCharactersOfNonExistingRoom(query.room);
    }
    return room.adventurers;
  }
}

export class CannotGetCharactersOfNonExistingRoom extends Error {
  constructor(name: string) {
    super(`Could not get characters for the not existing room ${name}`);
  }
}
