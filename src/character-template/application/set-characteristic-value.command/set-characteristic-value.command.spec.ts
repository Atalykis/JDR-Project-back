import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { CannotSetCharacteristicInsideNonExistingTemplate, CannotSetValueOfNonExistingCharacteristic, SetCharacteristicValueCommand, SetCharacteristicValueCommandHandler } from "./set-characteristic-value.command"

describe("SetCharacteristicValueCommand", () => {
    const templateStore = new CharacterTemplateStoreInMemory()
    it("should allow a user to set a new value for a characteristic", async () => {
        const elf = CharacterTemplateFixture.elf
        elf.addCharacteristic("Mana", "50")
        await templateStore.save(elf)

        const command : SetCharacteristicValueCommand = { id: elf.id, characteristicName: "Mana", value: "100"}
        const handler = new SetCharacteristicValueCommandHandler(templateStore)

        await handler.handle(command)

        const loaded = await templateStore.load(elf.id)
        expect(loaded!.getCharacteristic("Mana")).toEqual("100")
    })

    it("should not allow a user to set a characteristic value inside non existing character template", async () => {
        const template = CharacterTemplateFixture.orc
        const command : SetCharacteristicValueCommand = { id: template.id, characteristicName: "Mana", value: "100"}
        const handler = new SetCharacteristicValueCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotSetCharacteristicInsideNonExistingTemplate)
    })

    it("should not allow a user to set value of non existing characteristic", async () => {
        const template = CharacterTemplateFixture.human
        await templateStore.save(template)
        const command : SetCharacteristicValueCommand = { id: template.id, characteristicName: "Mana", value: "100"}
        const handler = new SetCharacteristicValueCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotSetValueOfNonExistingCharacteristic)
    })
})

