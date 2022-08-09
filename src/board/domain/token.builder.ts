import { CharacterIdentity } from "../../character/domain/character";
import { FixtureOf } from "../../typings/fixtures";
import { Position, Size, Token } from "./token";

export class TokenFixture {
  static basic50 = new Token(
    new Position({ x: 50, y: 50 }),
    new Size({ width: 50, height: 50 }),
    "https://dummyimage.com/50x50/000/ff00ff",
    new CharacterIdentity("Jojo", "Atalykis", "TheGreatEscape")
  );

  static basic100 = new Token(
    new Position({ x: 100, y: 100 }),
    new Size({ width: 50, height: 50 }),
    "https://dummyimage.com/50x50/000/ff00ff",
    new CharacterIdentity("basicCharacter", "Atalykis", "basicAdventure")
  );

  static basic150 = new Token(
    new Position({ x: 150, y: 150 }),
    new Size({ width: 50, height: 50 }),
    "https://dummyimage.com/50x50/000/ff00ff",
    new CharacterIdentity("basicCharacter", "Aetherall", "basicAdventure")
  );

  static basic200 = new Token(
    new Position({ x: 200, y: 200 }),
    new Size({ width: 50, height: 50 }),
    "https://dummyimage.com/50x50/000/ff00ff",
    new CharacterIdentity("basicCharacter", "Aetherall", "basicAdventure")
  );
}
