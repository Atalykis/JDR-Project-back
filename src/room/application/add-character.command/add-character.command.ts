import { CharacterIdentity } from "../../../character/domain/character";
import { RoomStore } from "../room.store";

export interface AddCharacterCommand {
  room: string;
  character: CharacterIdentity;
}

export class AddCharacterCommandHandler {
  constructor(private readonly roomStore: RoomStore) {}

  async handle(command: AddCharacterCommand) {
    const room = await this.roomStore.load(command.room);
    if (!room) {
      throw new CannotAddCharacterInsideNonExistingRoom(command.room);
    }
    room.addCharacter(command.character);
  }
}

export class CannotAddCharacterInsideNonExistingRoom extends Error {
  constructor(name: string) {
    super(`Could not add character in unexisting room ${name}`);
  }
}
