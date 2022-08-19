import { Inject } from "@nestjs/common";
import { Collection, MongoClient } from "mongodb";
import { CharacterStore } from "../../../application/character.store";
import { CharacterIdentity, Character } from "../../../domain/character";
import { MongoDbClient } from "../../mongodb/mongodb.client";

export class CharacterMongoStore implements CharacterStore {
  private collection: Collection 
  constructor(@Inject("MongoDbClient") private readonly mongoDbClient : MongoDbClient){
    this.collection = this.mongoDbClient.getCollection("characters")
  }

  async add(character: Character): Promise<void> {
    await this.collection.insertOne({name: character.name, owner: character.owner, adventure: character.adventure, description: character.description})
  }

  async load(character: CharacterIdentity): Promise<Character | undefined> {
    const loaded = await this.collection.findOne({ name: character.name, owner: character.owner, adventure: character.adventure })
    return this.serialize(loaded)
  }

  async loadAll(): Promise<Character[]> {
    const loaded = await this.collection.find().toArray()
    const serialized = loaded.map((character) => this.serialize(character))
    return serialized
  }

  async loadMany(charactersIds: CharacterIdentity[]): Promise<Character[]> {
    const loaded = []
    for (const id of charactersIds){
      loaded.push(await this.collection.findOne({name: id.name, owner: id.owner, adventure: id.adventure}))
    }
    const serialized: Character[] = loaded.map((character) => this.serialize(character))
    return serialized
  }

  async loadOwnedForAdventure(owner: string, adventure: string): Promise<Character[]> {
    const loaded = await this.collection.find({ owner: owner, adventure: adventure }).toArray();
    const serialized = loaded.map((character) => this.serialize(character))
    return serialized
  }

  async clear(): Promise<void> {
    await this.collection.drop()
  }

  private serialize(character: any){
    const serialized = new Character(character.name, character.owner, character.adventure, character.description)
    return serialized
  }

}