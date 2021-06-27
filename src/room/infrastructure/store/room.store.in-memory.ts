import { Room } from "../../domain/room";
import { RoomStore } from "./room.store";

export class RoomStoreInMemory implements RoomStore {
  private rooms: Room[] = [];

  load(name: string) {
    const room = this.rooms.find((room) => room.name === name);
    return room;
  }

  add(room: Room) {
    this.rooms.push(room);
  }

  clear() {
    this.rooms = [];
  }
}
