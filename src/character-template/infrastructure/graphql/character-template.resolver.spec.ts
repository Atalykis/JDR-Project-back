import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing";
import { gql } from "apollo-server-express";
import { BackendModule } from "../../../backend.module";
import { GraphqlTestClient } from "../../../test/graphql.test-client";
import { CannotAddCharacteristicInsideNonExistingTemplate } from "../../application/add-characteristic.command/add-characteristic.command";
import { CannotAddStatisticInsideNonExistingCharacterTemplate } from "../../application/add-statistic.command/add-statistic.command";
import { CannotCreateCharacterTemplateWithAlreadyTakenName } from "../../application/create-character-template.command/create-character-template.command";
import { CannotQueryUnexistingCharacterTemplateError } from "../../application/get-character-template.query/get-character-template.query";
import { CannotSetCharacteristicInsideNonExistingTemplate, CannotSetValueOfNonExistingCharacteristic } from "../../application/set-characteristic-value.command/set-characteristic-value.command";
import { CannotSetStatisticInsideNonExistingTemplate, CannotSetValueOfNonExistingStatistic } from "../../application/set-statistic-value.command/set-statistic-value.command";
import { CannotAddCharacteristicWithAlreadyTakenName, CannotAddStatisticWithAlreadyTakenName, CharacterTemplateId } from "../../domain/character-template";
import { CharacterTemplateFixture } from "../../domain/character-template.fixture";
import { CharacterTemplateStoreInMemory } from "../character-template.store.in-memory";

describe("CharacterTemplate Resolver", () => {
  let app: INestApplication;
  let graphql : GraphqlTestClient

  const templateStore = new CharacterTemplateStoreInMemory()

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [BackendModule],
    })
      .overrideProvider("CharacterTemplateStore")
      .useValue(templateStore)
      .compile();

    app = module.createNestApplication();
    await app.init();
  
    graphql = new GraphqlTestClient(app);
    graphql.as("Atalykis");
  });

  beforeEach(() => {
    templateStore.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Mutation character template", () => {
    const mutation = gql`
      mutation CreateCharacterTemplate($name: String!, $universe: String!) {
        createCharacterTemplate(name: $name, universe: $universe){
            name
            universe
        }
    }
    `
    it("should allow a user to create a character template", async () => {
      const { errors, data } = await graphql.execute(mutation, {
          name: "Elf",
          universe: "Dungeon & Dragon"
      })

      const createdTemplate = await templateStore.load(new CharacterTemplateId("Elf", "Dungeon & Dragon"))
        
      expect(errors).toBeUndefined()
      expect(createdTemplate).toBeDefined()
      expect(data).toEqual({
          createCharacterTemplate: {
              name: "Elf",
              universe: "Dungeon & Dragon"
          }
       })
    })

    it("should fail if a character template with the same name already existist in the same universe", async () => {
      const elf = CharacterTemplateFixture.elf
      templateStore.save(elf)
      
      const { errors, data } = await graphql.execute(mutation, {
        name: "Elf",
        universe: "Dungeon & Dragon"
    })

    expect(errors[0].message).toEqual(new CannotCreateCharacterTemplateWithAlreadyTakenName(elf.name, elf.universe).message)
    })
  })

  describe("Query universe character templates", () => {
    const query= gql`
      query UniverseCharacterTemplates($universe: String!){
        universeCharacterTemplates(universe: $universe){
          name
          universe
          characteristics{
            name
            value
          }
          statistics {
            name
            value {
              min
              max
            }
          }
        }
      }
    `

    it("should allow a user to retrieve all universe's character templates", async () => {
      const elf = CharacterTemplateFixture.elf
      const orc = CharacterTemplateFixture.orc
      templateStore.save(elf)
      templateStore.save(orc)

      const {errors, data } = await graphql.execute(query, {
        universe: "Dungeon & Dragon"
      })

      expect(errors).toBeUndefined()
      expect(data).toEqual({
        universeCharacterTemplates: [{ name: elf.name, universe: elf.universe, characteristics: elf.fullCharacteristics, statistics:elf.fullStatistics}, { name: orc.name, universe: orc.universe, characteristics: orc.fullCharacteristics, statistics:orc.fullStatistics}]
      })
    })
  })

  describe("Query character template", () => {
    const query= gql`
      query CharacterTemplate($universe: String!, $name: String!){
        characterTemplate(universe: $universe, name: $name){
          name
          universe
          characteristics{
            name
            value
          }
          statistics {
            name
            value {
              min
              max
            }
          }
        }
      }
    `

    it("should allow a user to a specific character template", async () => {
      const human = CharacterTemplateFixture.human
      templateStore.save(human)

      const {errors, data } = await graphql.execute(query, {
        name: "Human",
        universe: "Earth"
      })

      expect(errors).toBeUndefined()
      expect(data).toEqual({
        characterTemplate: { name: human.name, universe: human.universe, characteristics: human.fullCharacteristics, statistics:human.fullStatistics}
      })
    })

    it("should fail if the character template doesn't exist", async () => {
      const { errors, data } = await graphql.execute(query, {
        name: "Unexisting",
        universe: "Nothingness"
      })

      expect(errors[0].message).toEqual(new CannotQueryUnexistingCharacterTemplateError("Unexisting").message)
    })
  })

  describe("AddCharacteristicMutation", () => {
    const mutation = gql`
    mutation AddCharacteristic($id: CharacterTemplateIdInput!, $characteristic: CharacteristicInput!) {
      addCharacteristic(id: $id, characteristic: $characteristic){
          name
          universe
          characteristics {
            name
            value
          }
      }
    }
    `

    it("should allow a user to add a characteristic in a character template", async () => {
      const elf = CharacterTemplateFixture.elf
      templateStore.save(elf)

      const { errors, data } = await graphql.execute(mutation, {
        id: elf.id.toObject(),
        characteristic: {
          name: "Vitality",
          value: "50"
        }
      })

      expect(errors).toBeUndefined()
      expect(data.addCharacteristic.characteristics).toEqual([{
        name: "Vitality",
        value: "50"
      }])
    })

    it("should fail if the character template doesn't exist", async () => {
      const orc = CharacterTemplateFixture.orc
      const { errors, data } = await graphql.execute(mutation, {
        id: orc.id.toObject(),
        characteristic: {
          name: "Vitality",
          value: "50"
        }
      })

      expect(errors[0].message).toEqual(new CannotAddCharacteristicInsideNonExistingTemplate(orc.id).message)
    })

    it("should fail if the character template already have a characteristic sharing the same name", async () => {
      const human = CharacterTemplateFixture.human
      human.addCharacteristic("Vitality", "50")
      templateStore.save(human)

      const { errors, data } = await graphql.execute(mutation, {
        id: human.id.toObject(),
        characteristic: {
          name: "Vitality",
          value: "50"
        }
      })

      expect(errors[0].message).toEqual(new CannotAddCharacteristicWithAlreadyTakenName("Vitality").message)
    })
  })

  describe("SetCharacteristicValueMutation", () => {
    const mutation = gql`
    mutation SetCharacteristicValue($id: CharacterTemplateIdInput!, $characteristic: CharacteristicInput!) {
      setCharacteristicValue(id: $id, characteristic: $characteristic){
          name
          universe
          characteristics {
            name
            value
          }
      }
    }
    `

    it("should allow a user to set a characteristic value in a character template", async () => {
      const orc = CharacterTemplateFixture.orc
      orc.addCharacteristic("Vitality", "50")
      await templateStore.save(orc)

      const { errors, data } = await graphql.execute(mutation, {
        id: orc.id.toObject(),
        characteristic: {
          name: "Vitality",
          value: "100"
        }
      })

      expect(errors).toBeUndefined()
      expect(data.setCharacteristicValue.characteristics).toEqual([{
        name: "Vitality",
        value: "100"
      }])
    })

    it("should fail if the character template doesn't exist", async () => {
      const unexistingId = new CharacterTemplateId("Unexisting", "Nothingness")
      const { errors, data } = await graphql.execute(mutation, {
        id: unexistingId.toObject(),
        characteristic: {
          name: "Vitality",
          value: "50"
        }
      })

      expect(errors[0].message).toEqual(new CannotSetCharacteristicInsideNonExistingTemplate(unexistingId).message)
    })

    it("should fail if the characteristic doesn't exist", async () => {
      const human = CharacterTemplateFixture.human
      await templateStore.save(human)

      const { errors, data } = await graphql.execute(mutation, {
        id: human.id.toObject(),
        characteristic: {
          name: "Unexisting",
          value: "Infinity"
        }
      })

      expect(errors[0].message).toEqual(new CannotSetValueOfNonExistingCharacteristic("Unexisting").message)
    })
  })

  describe("AddStatisticMutation", () => {
    const mutation = gql`
    mutation AddStatistic($id: CharacterTemplateIdInput!, $statistic: StatisticInput!) {
      addStatistic(id: $id, statistic: $statistic){
          name
          universe
          statistics {
            name
            value {
              min
              max
            }
          }
      }
    }
    `
    it("should allow a user to add a statistic inside a character template", async () => {
    const elf = CharacterTemplateFixture.elf
    templateStore.save(elf)

      const { errors, data } = await graphql.execute(mutation, {
        id: elf.id.toObject(),
        statistic: {
          name: "Strength",
          value: {
            min: 10,
            max: 90
          }
        }
      })
      
      expect(errors).toBeUndefined()
      expect(data.addStatistic.statistics).toEqual([{
        name: "Strength",
        value: {
          min: 10,
          max: 90
        }
      }])
    })

    it("should fail if the character template doesn't exist", async () => {
      const orc = CharacterTemplateFixture.orc
      const { errors, data } = await graphql.execute(mutation, {
        id: orc.id.toObject(),
        statistic: {
          name: "Strength",
          value: {
            min: 10,
            max: 90
          }
        }
      })

      expect(errors[0].message).toEqual(new CannotAddStatisticInsideNonExistingCharacterTemplate(orc.id).message)
    })

    it("should fail if the character template already have a statistic sharing the same name", async () => {
      const human = CharacterTemplateFixture.human
      human.addStatistic("Strength", { min: 10, max: 90 })
      templateStore.save(human)

      const { errors, data } = await graphql.execute(mutation, {
        id: human.id.toObject(),
        statistic: {
          name: "Strength",
          value: {
            min: 10,
            max: 90
          }
        }
      })

      expect(errors[0].message).toEqual(new CannotAddStatisticWithAlreadyTakenName("Strength").message)
    })
  })

  describe("SetStatisticValueMutation", () => {
    const mutation = gql`
    mutation SetStatisticValue($id: CharacterTemplateIdInput!, $statistic: StatisticInput!) {
      setStatisticValue(id: $id, statistic: $statistic){
          name
          universe
          statistics {
            name
            value {
              min
              max
            }
          }
      }
    }
    `

    it("should allow a user to set a statistic value in a character template", async () => {
      const orc = CharacterTemplateFixture.orc
      orc.addStatistic("Strength", { min: 10, max: 90 })
      await templateStore.save(orc)

      const { errors, data } = await graphql.execute(mutation, {
        id: orc.id.toObject(),
        statistic: {
          name: "Strength",
          value: {
            min: 1,
            max: 19
          }
        }
      })

      expect(errors).toBeUndefined()
      expect(data.setStatisticValue.statistics).toEqual([{
        name: "Strength",
        value: {
          min: 1,
          max: 19
        }
      }])
    })

    it("should fail if the character template doesn't exist", async () => {
      const unexistingId = new CharacterTemplateId("Unexisting", "Nothingness")
      const { errors, data } = await graphql.execute(mutation, {
        id: unexistingId.toObject(),
        statistic: {
          name: "Strength",
          value: {
            min: 1,
            max: 19
          }
        }
      })

      expect(errors[0].message).toEqual(new CannotSetStatisticInsideNonExistingTemplate(unexistingId).message)
    })

    it("should fail if the statistic doesn't exist", async () => {
      const human = CharacterTemplateFixture.human
      await templateStore.save(human)

      const { errors, data } = await graphql.execute(mutation, {
        id: human.id.toObject(),
        statistic: {
          name: "Unexisting",
          value: {
            min: 0,
            max: 1
          }
        }
      })

      expect(errors[0].message).toEqual(new CannotSetValueOfNonExistingStatistic("Unexisting").message)
    })
  })
})