import { CharacterTemplateId } from "../../domain/character-template"
import { CharacterTemplateFixture } from "../../domain/character-template.fixture"
import { CharacterTemplateStoreInMemory } from "../../infrastructure/character-template.store.in-memory"
import { CharacterTemplateStore } from "../character-template.store"
import { CannotQueryUnexistingCharacterTemplateError, GetCharacterTemplateQuery, GetCharacterTemplateQueryHandler } from "./get-character-template.query"

describe("GetCharacterTemplateQuery", () => {
  it("should allow a user to retrieve a specific character template", async () => {
    const elf = CharacterTemplateFixture.elf
    const templateStore = new CharacterTemplateStoreInMemory()
    await templateStore.save(elf)

    const query: GetCharacterTemplateQuery = {name: elf.name, universe: elf.universe}
    const handler = new GetCharacterTemplateQueryHandler(templateStore)

    const loaded = await handler.handle(query)

    expect(loaded).toEqual(elf)
  })

  it('should not allow a user to retrieve an unexisting character template', async () => {
    const templateStore = new CharacterTemplateStoreInMemory()

    const query: GetCharacterTemplateQuery = {name: "Unexisting", universe: "Nothingness"}
    const handler = new GetCharacterTemplateQueryHandler(templateStore)

    await expect(() => handler.handle(query)).rejects.toThrow(CannotQueryUnexistingCharacterTemplateError)
  })
})

