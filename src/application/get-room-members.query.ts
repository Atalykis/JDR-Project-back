import { Room } from "../domain/room";
import { RoomStore } from "./room.store";

export interface GetRoomMembersQuery {
  room: string;
}

export class GetRoomMembersHandler {
  constructor(private readonly roomStore: RoomStore) {}

  handle(query: GetRoomMembersQuery) {
    const room = this.roomStore.load(query.room);
    if (!room) {
      throw new CannotGetMembersOfNonExistingRoom(query.room);
    }
    return room.members;
  }
}

export class CannotGetMembersOfNonExistingRoom extends Error {
  constructor(name: string) {
    super(`Could not get members for the not found ${name} room`);
  }
}
