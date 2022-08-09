import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { CharacterTemplateStore } from "../character-template.store"
import { GetUniverseCharacterTemplatesQuery, GetUniverseCharacterTemplatesQueryHandler } from "./get-universe-character-templates"

describe("GetUniverseCharacterTemplateQuery", () => {
  it("should allow a user to retrieve all character templates of a specific universe", async () => {
    const elf = CharacterTemplateFixture.elf
    const human = CharacterTemplateFixture.human
    const orc = CharacterTemplateFixture.orc
    const templateStore = new CharacterTemplateStoreInMemory()
    await templateStore.save(elf)
    await templateStore.save(human)
    await templateStore.save(orc)

    const query: GetUniverseCharacterTemplatesQuery = {universe: elf.universe}
    const handler = new GetUniverseCharacterTemplatesQueryHandler(templateStore)

    const loaded = await handler.handle(query)

    expect(loaded).toEqual([elf, orc])
  })
})

