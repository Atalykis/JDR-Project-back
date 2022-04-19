import { Adventure } from "./adventure";

class AdventureBuilder {
  name: string;
  gm: string;

  withName(name: string) {
    this.name = name;
    return this;
  }

  as(gm: string) {
    this.gm = gm;
    return this;
  }

  build() {
    return new Adventure(this.name, this.gm);
  }
}

export class AdventureFixtures {
  static greatEscape = new AdventureBuilder().withName("TheGreatEscape").as("gm").build();
  static basicAdventure = new AdventureBuilder().withName("basicAdventure").as("gm").build();
}
