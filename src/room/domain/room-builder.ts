import { Room } from "./room";

class RoomBuilder {
  name: string;
  gm: string;
  adventure: string;

  withName(name: string) {
    this.name = name;
    return this;
  }

  as(gm: string) {
    this.gm = gm;
    return this;
  }

  inside(adventure: string) {
    this.adventure = adventure;
    return this;
  }

  build() {
    return new Room(this.name, this.gm, this.adventure);
  }
}

export class RoomFixtures {
  static greatRoom = new RoomBuilder().withName("greatRoom").as("gm").inside("TheGreatEscape").build();

  static atalykisGreatRoom = new RoomBuilder().withName("greatRoom").as("Atalykis").inside("TheGreatEscape").build();
  static escapeRoom = new RoomBuilder().withName("escapeRoom").as("gm").inside("TheGreatEscape").build();
  static basicRoom = new RoomBuilder().withName("basicRoom").as("gm").inside("basicAdventure").build();
}
