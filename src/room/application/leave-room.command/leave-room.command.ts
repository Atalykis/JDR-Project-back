import { RoomStore } from "../room.store";

export interface LeaveRoomCommand {
  user: string;
  room: string;
}

export class LeaveRoomHandler {
  constructor(private readonly roomStore: RoomStore) {}

  async handle(command: LeaveRoomCommand) {
    const room = await this.roomStore.load(command.room);
    if (!room) {
      throw new CannotLeaveUnexistingRoomError(command.room);
    }
    if (!room.has(command.user)) {
      throw new CannotLeaveUnjoinedRoomError(command.user);
    }
    room.leave(command.user);
  }
}

export class CannotLeaveUnexistingRoomError extends Error {
  constructor(name: string) {
    super(`Could not leave the room : No room for the name ${name}`);
  }
}

export class CannotLeaveUnjoinedRoomError extends Error {
  constructor(user: string) {
    super(`Could not leave the room because ${user} was not present`);
  }
}
