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

class CharacterBuilder {
  constructor(
    public name: string,
    public owner: string,
    public adventure: string,
    public description: string = "Default description" // public spells: Spell[] = []
  ) {}

  for(owner: string) {
    this.owner = owner;
    return this;
  }

  // addSpell(spell: Spell | FixtureIn<typeof SpellFixtures>) {
  //   this.spells.push(SpellFixtures.resolve(spell));
  //   return this;
  // }

  build() {
    return new Character(this.name, this.owner, this.adventure, this.description);
  }
}

export class CharacterFixtures {
  static get Jojo() {
    return new CharacterBuilder("Jojo", "Atalykis", "TheGreatEscape");
  }

  static get Dio() {
    return new CharacterBuilder("Dio", "Atalykis", "TheGreatEscape");
  }
}
