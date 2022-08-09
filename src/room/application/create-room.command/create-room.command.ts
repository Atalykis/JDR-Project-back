import { BoardStore } from "../../../board/application/board.store";
import { Board } from "../../../board/domain/board";
import { Room } from "../../domain/room";
import { RoomStore } from "../room.store";

export interface CreateRoomCommand {
  name: string;
  gm: string;
  adventure: string;
}

export class CreateRoomHandler {
  constructor(private readonly roomStore: RoomStore, private readonly boardStore: BoardStore) {}

  async handle(command: CreateRoomCommand) {
    const alreadyExistingRoom = await this.roomStore.load(command.name);

    if (alreadyExistingRoom) {
      throw new CannotCreateRoomWithAlreadyTakenNameError(command.name);
    }
    const room = new Room(command.name, command.gm, command.adventure);
    await this.roomStore.add(room);
    const board = new Board(command.name)
    await this.boardStore.save(board)
    return room.name;
  }
}

export class CannotCreateRoomWithAlreadyTakenNameError extends Error {
  constructor(name: string) {
    super(`Could not create room ${name} because name was already taken`);
  }
}
