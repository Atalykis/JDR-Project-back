import { Constructor } from "./constructor";

type FixtureKeys<FixtureClass extends Constructor<any>> = keyof Omit<FixtureClass, "prototype" | "resolve">;

export type FixtureOf<FixtureClass extends Constructor<any>> = FixtureKeys<FixtureClass> | FixtureClass[FixtureKeys<FixtureClass>];
