import { Room } from "../domain/room";

export interface RoomStore {
  load(name: string): Promise<Room | undefined>;

  loadManyFromAdventure(adventure: string): Promise<Room[]>;
  add(room: Room): Promise<void>;
}
