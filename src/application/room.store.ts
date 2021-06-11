import { Room } from "../domain/room";

export interface RoomStore {
  load(name: string): Room | undefined;
  add(room: Room): void;
}
