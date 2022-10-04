import { Universe } from "../../domain/universe"
import { UniverseStore } from "../universe.store"

export interface CreateUniverseCommand {
  name: string
  owner: string
}

export class CreateUniverseCommandHandler {
  constructor(private readonly universeStore: UniverseStore){}

  async handle(command: CreateUniverseCommand){
    const existing = await this.universeStore.load(command.name)
    if(existing && existing.owner === command.owner){
      throw new CannotCreateUniverseWithAlreadyTakenNameError(command.name)
    }
    const universe = new Universe(command.name, command.owner)
    await this.universeStore.add(universe)

  }
}

export class CannotCreateUniverseWithAlreadyTakenNameError extends Error {
  constructor(name: string){
    super(`Cannot create universe with already taken name : ${name} for user`)
  }
}

