import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { CannotSetStatisticInsideNonExistingTemplate, CannotSetValueOfNonExistingStatistic, SetStatisticValueCommand, SetStatisticValueCommandHandler } from "./set-statistic-value.command"

describe("SetStatisticValueCommand", () => {
    it("should allow a user to set the value of a statistic", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const elf = CharacterTemplateFixture.elf
        elf.addStatistic("Intellect", {min: 10, max: 90})
        await templateStore.save(elf)

        const command: SetStatisticValueCommand = {id: elf.id, statName: "Intellect", value: {min: 0, max: 20}}
        const handler = new SetStatisticValueCommandHandler(templateStore)

        await handler.handle(command)
        const loaded = await templateStore.load(elf.id)

        expect(loaded!.getStatistic("Intellect")).toEqual({ min: 0, max: 20 })
    })

    it("should not allow to set a statistic of an non existing character template", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const orc = CharacterTemplateFixture.orc

        const command: SetStatisticValueCommand = {id: orc.id, statName: "Intellect", value: {min: 0, max: 20}}
        const handler = new SetStatisticValueCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotSetStatisticInsideNonExistingTemplate)

    })

    it("should not allow to set a statistic of an non existing character template", async () => {
        const templateStore = new CharacterTemplateStoreInMemory()
        const orc = CharacterTemplateFixture.orc
        await templateStore.save(orc)

        const command: SetStatisticValueCommand = {id: orc.id, statName: "Intellect", value: {min: 0, max: 20}}
        const handler = new SetStatisticValueCommandHandler(templateStore)

        await expect(() => handler.handle(command)).rejects.toThrow(CannotSetValueOfNonExistingStatistic)

    })
})

