import { RoomStore } from "../../application/room.store";
import { Room } from "../../domain/room";

export class RoomStoreInMemory implements RoomStore {
  private rooms: Room[] = [new Room("TheBizarreRoom", "gm", "TheBizarreAdventure")];

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
