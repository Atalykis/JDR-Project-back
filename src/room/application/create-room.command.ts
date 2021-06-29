import { Room } from "../domain/room";
import { RoomStore } from "../infrastructure/store/room.store";

export interface CreateRoomCommand {
  name: string;
  mj: string;
}

export class CreateRoomHandler {
  constructor(private readonly roomStore: RoomStore) {}

  handle(command: CreateRoomCommand) {
    const alreadyExistingRoom = this.roomStore.load(command.name);

    if (alreadyExistingRoom) {
      throw new CannotCreateRoomWithAlreadyTakenNameError(command.name);
    }
    const room = new Room(command.name, command.mj);
    this.roomStore.add(room);
    return room.name;
  }
}

export class CannotCreateRoomWithAlreadyTakenNameError extends Error {
  constructor(name: string) {
    super(`Could not create room ${name} because name was already taken`);
  }
}