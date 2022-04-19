import { Room } from "../../domain/room";
import { RoomStore } from "../room.store";

export interface CreateRoomCommand {
  name: string;
  gm: string;
  adventure: string;
}

export class CreateRoomHandler {
  constructor(private readonly roomStore: RoomStore) {}

  async handle(command: CreateRoomCommand) {
    const alreadyExistingRoom = await this.roomStore.load(command.name);

    if (alreadyExistingRoom) {
      throw new CannotCreateRoomWithAlreadyTakenNameError(command.name);
    }
    const room = new Room(command.name, command.gm, command.adventure);
    await this.roomStore.add(room);
    return room.name;
  }
}

export class CannotCreateRoomWithAlreadyTakenNameError extends Error {
  constructor(name: string) {
    super(`Could not create room ${name} because name was already taken`);
  }
}
