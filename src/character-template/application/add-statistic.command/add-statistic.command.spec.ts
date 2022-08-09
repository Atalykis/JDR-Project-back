import { CannotAddStatisticWithAlreadyTakenName } from "../../domain/character-template"
import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { AddStatisticCommand, AddStatisticCommandHandler, CannotAddStatisticInsideNonExistingCharacterTemplate } from "./add-statistic.command"

describe("AddStatisticCommand", () => {
    it("should allow a user to add a statistic in a character template", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const elf = CharacterTemplateFixture.elf
        templateStore.save(elf)

        const command: AddStatisticCommand = { id: elf.id, statName: "Intellect", value: { min: 10, max: 90 }}
        const handler = new AddStatisticCommandHandler(templateStore)

        await handler.handle(command)

        const loaded = await templateStore.load(elf.id)
        expect(loaded!.getStatistic("Intellect")).toEqual({ min: 10, max: 90 })
    })

    it("should not allow to add a statistic with name already taken", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const orc = CharacterTemplateFixture.orc
        orc.addStatistic("Intellect", {min: 10, max: 90})
        templateStore.save(orc)

        const command: AddStatisticCommand = { id: orc.id, statName: "Intellect", value: { min: 10, max: 90 }}
        const handler = new AddStatisticCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotAddStatisticWithAlreadyTakenName)
    })

    it("should not allow to add a statistic inside non existing character template", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const elf = CharacterTemplateFixture.elf

        const command: AddStatisticCommand = { id: elf.id, statName: "Intellect", value: { min: 10, max: 90 }}
        const handler = new AddStatisticCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotAddStatisticInsideNonExistingCharacterTemplate)
    })
})
