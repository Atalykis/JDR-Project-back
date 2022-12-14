import { CharacterIdentity } from "../../../character/domain/character";
import { RoomStore } from "../room.store";

export interface JoinRoomCommand {
  room: string;
  user: string;
}

export class JoinRoomHandler {
  constructor(private readonly roomStore: RoomStore) {}

  async handle(command: JoinRoomCommand) {
    const room = await this.roomStore.load(command.room);
    if (!room) {
      throw new CannotJoinUnexistingRoomError(command.room);
    }
    if (room.has(command.user)) {
      throw new CannotJoinAleadyJoinedRoomError(command.user);
    }

    room.join(command.user);
  }
}

export class CannotJoinAleadyJoinedRoomError extends Error {
  constructor(user: string) {
    super(`Could not join the room because ${user} was already present`);
  }
}

export class CannotJoinUnexistingRoomError extends Error {
  constructor(room: string) {
    super(`Could not join the room because ${room} does not exist`);
  }
}
