import { InjectModel, Schema, Prop, SchemaFactory, MongooseModule } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CharacterStore } from "../../../application/character.store";
import { Character, CharacterIdentity } from "../../../domain/character";

@Schema()
export class CharacterModel {

  @Prop()
  name: string;

  @Prop()
  owner: string;

  @Prop()
  adventure: string;

  @Prop()
  description: string;
} 

// NestJS Mongoose module
export const CharacterSchema = SchemaFactory.createForClass(CharacterModel);
export const MongooseCharacterProvider = MongooseModule.forFeature([{ name: CharacterModel.name, schema: CharacterSchema }])

export class CharacterMongooseStore implements CharacterStore {
  constructor(@InjectModel(CharacterModel.name) private characterModel: Model<Character>) {
  }

  async add(character: Character): Promise<void> {
   
    const serializedCharacter = await this.characterModel.create({
      name: character.name,
      owner: character.owner,
      adventure: character.adventure,
      description: character.description,
    })
    await serializedCharacter.save();
  }

  async loadOwnedForAdventure(owner: string, adventure: string): Promise<Character[]> {
    const loaded = await this.characterModel.find({ owner: owner, adventure: adventure });
    const serialized = loaded.map((character) => this.serialize(character))
    return serialized
  }

  async load(character: CharacterIdentity): Promise<Character | undefined> {
    const loaded = await this.characterModel.findOne({ name: character.name, owner: character.owner, adventure: character.adventure }).exec();
    return this.serialize(loaded)
  }

  async loadMany(charactersIds: CharacterIdentity[]): Promise<Character[]> {
    const loaded = []
    for (const id of charactersIds){
      loaded.push(await this.characterModel.findOne({name: id.name, owner: id.owner, adventure: id.adventure}))
    }
    const serialized: Character[] = loaded.map((character) => this.serialize(character))
    return serialized
  }

  async loadAll(): Promise<Character[]> {
    const loaded = await this.characterModel.find()
    const serialized: Character[] = loaded.map((character) => this.serialize(character))
    return serialized
  }

  private serialize(character: any){
    const serialized = new Character(character.name, character.owner, character.adventure, character.description)
    return serialized
  }

  async clear(){
    await this.characterModel.db.dropDatabase()
  }
}
