import { RoomStore } from "../../application/room.store";
import { Room } from "../../domain/room";
import { RoomFixtures } from "../../domain/room-builder";

export class RoomStoreInMemory implements RoomStore {
  private rooms: Room[] = [];

  async init() {
    this.rooms = [RoomFixtures.atalykisGreatRoom, RoomFixtures.basicRoom, RoomFixtures.escapeRoom];
  }

  async onModuleInit() {
    await this.init();
  }

  async load(name: string) {
    const room = this.rooms.find((room) => room.name === name);
    return room;
  }

  async loadManyFromAdventure(adventure: string): Promise<Room[]> {
    const rooms = this.rooms.filter((room) => room.adventure === adventure);
    return rooms;
  }

  async add(room: Room) {
    this.rooms.push(room);
  }

  clear() {
    this.rooms = [];
  }
}
