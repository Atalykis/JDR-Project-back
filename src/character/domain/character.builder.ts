import { Character } from "./character";

// class Spell {}

// class SpellBuilder {}

// class SpellFixtures {
//   static fireball = new Spell();
//   static icestorm = new Spell();

//   static resolve(spell: Spell | keyof typeof this) {
//     if (spell instanceof Spell) return spell;
//     return this[spell];
//   }
// }

// type FixtureIn<T extends new (...args: any[]) => any> = keyof T

// addSpell(spell: Spell | FixtureIn<typeof SpellFixtures>) {
//   this.spells.push(SpellFixtures.resolve(spell));
//   return this;
// }
class CharacterBuilder {
  public owner: string;
  public adventure: string;
  constructor(
    public name: string,
    public description: string = "Default description" // public spells: Spell[] = []
  ) {}

  for(owner: string) {
    this.owner = owner;
    return this;
  }

  inside(adventure: string) {
    this.adventure = adventure;
    return this;
  }

  build() {
    return new Character(this.name, this.owner, this.adventure, this.description);
  }
}

export class CharacterFixtures {
  static get Jojo() {
    return new CharacterBuilder("Jojo").inside("TheGreatEscape").for("Atalykis").build();
  }

  static get Jonathan() {
    return new CharacterBuilder("Jonathan").inside("TheGreatEscape").for("Atalykis").build();
  }

  static get Dio() {
    return new CharacterBuilder("Dio").inside("TheGreatEscape").for("Aetherall").build();
  }

  static get Adventurer() {
    return new CharacterBuilder("Adventurer").for("Atalykis").inside("basicAdventure").build();
  }
}
