import { CharacterTemplateId } from "../../domain/character-template"
import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { CannotCreateCharacterTemplateWithAlreadyTakenName, CreateCharacterTemplateCommand, CreateCharacterTemplateCommandHandler } from "./create-character-template.command"

describe("CharacterTemplateCommand", () => {
    it("should allow a user to create a character template", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const command : CreateCharacterTemplateCommand = {name: "Elf", universe: "Dungeon & Dragon"}
        const handler = new CreateCharacterTemplateCommandHandler(templateStore)
        
        await handler.handle(command)
        
        const loaded = await templateStore.load(new CharacterTemplateId("Elf", "Dungeon & Dragon"))
        
        expect(loaded).toBeDefined
    })

    it("should not allow to create two character template with sharing name", async () => {
        const templateStore = new CharacterTemplateStoreInMemory() 
        const existing = CharacterTemplateFixture.elf
        templateStore.save(existing)
        const command : CreateCharacterTemplateCommand = {name: "Elf", universe: "Dungeon & Dragon"}
        const handler = new CreateCharacterTemplateCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotCreateCharacterTemplateWithAlreadyTakenName)        
    })
})






