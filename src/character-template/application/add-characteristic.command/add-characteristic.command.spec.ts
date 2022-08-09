import { CannotAddCharacteristicWithAlreadyTakenName } from "../../domain/character-template"
import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { AddCharacteristicCommand, AddCharacteristicCommandHandler, CannotAddCharacteristicInsideNonExistingTemplate } from "./add-characteristic.command"

describe("AddCharacteristicCommand", () => {
    const templateStore = new CharacterTemplateStoreInMemory()
    it("should allow a user to add a characteristic in a character template", async () => {
        const template = CharacterTemplateFixture.elf
        await templateStore.save(template)
        const command : AddCharacteristicCommand = {id: template.id, characteristicName: "Mana", value: "50"}
        const handler = new AddCharacteristicCommandHandler(templateStore)
        await handler.handle(command)

        const loaded = await templateStore.load(template.id)

        expect(loaded!.hasCharacteristic("Mana")).toBeTruthy()
        expect(loaded!.getCharacteristic("Mana")).toBe("50")
    })

    it("should not allow a user to add a characteristic with already taken name", async () => {
        const template = CharacterTemplateFixture.elf
        template.addCharacteristic("Vitality", "50")
        await templateStore.save(template)
        const command : AddCharacteristicCommand = {id: template.id, characteristicName: "Vitality", value: "50"}
        const handler = new AddCharacteristicCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotAddCharacteristicWithAlreadyTakenName)
    })

    it("should not allow a user to add a characteristic inside non existing character template", async () => {
        const template = CharacterTemplateFixture.orc
        const command : AddCharacteristicCommand = {id: template.id, characteristicName: "Vitality", value: "50"}
        const handler = new AddCharacteristicCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotAddCharacteristicInsideNonExistingTemplate)
    })
})



