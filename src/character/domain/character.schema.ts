import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CharacterDocument = Character & Document;

@Schema()
export class Character {
  @Prop()
  name: string;

  @Prop()
  owner: string;

  @Prop()
  adventure: string;

  @Prop()
  description: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);
