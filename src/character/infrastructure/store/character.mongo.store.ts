import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CharacterStore } from "../../application/character.store";
import { Character, CharacterIdentity } from "../../domain/character";
import { Character as CharacterModel, CharacterDocument } from "../../domain/character.schema";

export class CharacterMongoStore implements CharacterStore {
  constructor(@InjectModel(CharacterModel.name) private characterModel: Model<CharacterDocument>) {}

  async add(character: Character): Promise<void> {
    const created = new this.characterModel({
      name: character.name,
      owner: character.owner,
      adventure: character.adventure,
      description: character.description,
    });

    await created.save();
  }

  async loadOwnedForAdventure(owner: string, adventure: string): Promise<Character[]> {
    return this.characterModel.find({ owner: owner, adventure: adventure });
  }

  async load(character: CharacterIdentity): Promise<Character | undefined> {
    // const loaded = await this.characterModel.find({ name: character.name, owner: character.owner, adventure: character.adventure }).exec();
    // console.log(loaded);
    return;
  }

  async loadMany(charactersIds: CharacterIdentity[]): Promise<Character[]> {
    return [];
  }
}
