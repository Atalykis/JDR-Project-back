import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Field, ObjectType, Query, InputType, Mutation, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { DrawLineCommandHandler } from "../../application/draw-line.command/draw-line.command";
import { GetLinesQueryHandler } from "../../application/get-lines.query/get-lines.query";
import { WatchLineSubscriptionHandler } from "../../application/watch-lines.subscription/watch-lines.subscription";
import { Line } from "../../domain/line";
import { LineFixtures } from "../../domain/line.builder";
import { Point } from "../../domain/point";

@InputType("PointInput")
@ObjectType("PointType")
class PointType {
  @Field()
  x: number;

  @Field()
  y: number;
}

@InputType("LineInput")
@ObjectType("LineType")
class LineType {
  @Field()
  color: string;

  @Field()
  thickness: number;

  @Field(() => [PointType])
  points: PointType[];
}

// @InputType("OwnedLineInput")
// @ObjectType("OwnedLineType")
// class OwnedLineType {
//   @Field()
//   line: LineType;

//   @Field()
//   author: string;
// }

@ObjectType()
class BoardType {
  @Field()
  roomName: string;

  @Field(() => [LineType])
  lines: LineType[];
}

@Resolver()
export class BoardResolver {
  constructor(
    private readonly getLinesQueryHandler: GetLinesQueryHandler,
    private readonly drawLineCommandHandler: DrawLineCommandHandler,
    private readonly watchLinesSubscriptionHandler: WatchLineSubscriptionHandler
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => BoardType)
  async board(@Args("roomName") roomName: string): Promise<BoardType> {
    const lines = await this.getLinesQueryHandler.handle({ roomName });
    console.log("returning", lines);
    return {
      roomName,
      lines: lines.map((line) => line.serialize()),
    };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => BoardType)
  async draw(@Username() author: string, @Args("roomName") roomName: string, @Args("line") lineInput: LineType): Promise<BoardType> {
    const line = Line.deserialize(lineInput);
    line.ensureValidity();

    await this.drawLineCommandHandler.handle({ roomName, line, author });

    return this.board(roomName);
  }
}
