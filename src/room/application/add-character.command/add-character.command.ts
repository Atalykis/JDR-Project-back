import { BoardStore } from "../../../board/application/board.store";
import { Position, Size, Token } from "../../../board/domain/token";
import { Character, CharacterIdentity } from "../../../character/domain/character";
import { RoomStore } from "../room.store";

export interface AddCharacterCommand {
  room: string;
  character: CharacterIdentity;
}

export class AddCharacterCommandHandler {
  constructor(private readonly roomStore: RoomStore, private readonly boardStore: BoardStore) {}

  async handle(command: AddCharacterCommand) {
    const room = await this.roomStore.load(command.room);
    if (!room) {
      throw new CannotAddCharacterInsideNonExistingRoom(command.room);
    }
    room.addCharacter(command.character);
    const token = Token.initialTokenFor(command.character)
    
    const board = await this.boardStore.load(command.room)
    if (!board){
      return
    }
    board.addToken(command.character.owner, token)
    this.boardStore.save(board)
  }
}

export class CannotAddCharacterInsideNonExistingRoom extends Error {
  constructor(name: string) {
    super(`Could not add character in unexisting room ${name}`);
  }
}
