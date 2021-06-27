import { RoomStore } from "../infrastructure/store/room.store";

export interface KickPlayerCommand {
  room: string;
  player: string;
  originator: string;
}

export class KickPlayerHandler {
  constructor(private readonly roomStore: RoomStore) {}

  handle(command: KickPlayerCommand) {
    const room = this.roomStore.load(command.room);
    if (!room) {
      throw new CannotKickPlayerFromNonExistingRoomError(command.room);
    }
    if (!room.has(command.player)) {
      throw new CannotKickPlayerOutsideARoomError(command.room);
    }
    if (!(room.mj === command.originator)) {
      throw new CannotKickPlayerIfNotMjError(command.room);
    }
    room.kick(command.player);
  }
}

export class CannotKickPlayerFromNonExistingRoomError extends Error {
  constructor(room: string) {
    super(`Cannot kick a player from non existing room ${room}`);
  }
}

export class CannotKickPlayerOutsideARoomError extends Error {
  constructor(room: string) {
    super(`Cannot kick a player outside of the room ${room}`);
  }
}

export class CannotKickPlayerIfNotMjError extends Error {
  constructor(room: string) {
    super(`Cannot kick player in the ${room} you're not mj`);
  }
}
