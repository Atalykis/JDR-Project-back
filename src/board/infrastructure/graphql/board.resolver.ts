import { UseGuards } from "@nestjs/common";
import { Resolver, Args, Field, ObjectType, Query, InputType, Mutation, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { CharacterIdentity } from "../../../character/domain/character";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { DrawLineCommandHandler } from "../../application/draw-line.command/draw-line.command";
import { GetBoardQueryHandler } from "../../application/get-board.query/get-board.query";
import { GetLinesQueryHandler } from "../../application/get-lines.query/get-lines.query";
import { MoveTokenCommandHandler } from "../../application/move-token.command/move-token.command";
import { WatchLineSubscriptionHandler } from "../../application/watch-lines.subscription/watch-lines.subscription";
import { Line } from "../../domain/line";
import { LineFixtures } from "../../domain/line.builder";
import { Point } from "../../domain/point";
import { Position, Size, Token } from "../../domain/token";

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

@InputType('TokenIdInput')
@ObjectType('TokenIdType')
class TokenIdType {
  @Field()
  name: string

  @Field()
  owner: string

  @Field()
  adventure: string
}

@InputType('PositionInput')
@ObjectType("PositionType")
class PositionType {
  @Field()
  x: number;

  @Field()
  y: number;
}


@InputType('SizeInput')
@ObjectType("SizeType")
class SizeType {
  @Field()
  width: number;

  @Field()
  height: number;
}

@InputType('TokenInput')
@ObjectType("TokenType")
class TokenType {
  @Field(() => TokenIdType)
  id: TokenIdType

  @Field(() => PositionType)
  position: PositionType

  @Field(() => SizeType)
  size: SizeType

  @Field()
  imageSrc: string;
}

@ObjectType()
class BoardType {
  @Field()
  roomName: string;

  @Field(() => [LineType])
  lines: LineType[];

  @Field(() => [TokenType])
  tokens?: TokenType[];
}

@Resolver()
export class BoardResolver {
  constructor(
    private readonly getLinesQueryHandler: GetLinesQueryHandler,
    private readonly moveTokenCommandHandler: MoveTokenCommandHandler,
    private readonly getBoardQueryHandler: GetBoardQueryHandler,
    private readonly drawLineCommandHandler: DrawLineCommandHandler,
    private readonly watchLinesSubscriptionHandler: WatchLineSubscriptionHandler
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => BoardType)
  async board(@Args("roomName") roomName: string): Promise<BoardType> {
    const board = await this.getBoardQueryHandler.handle({ roomName });
    if (!board) return {
      roomName,
      lines:[],
      tokens:[]
    }
    return {
      roomName,
      lines: board.lines.map((line) => line.serialize()),
      tokens:board.tokens.map((token) => token.serialize()),
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

  @UseGuards(AuthGuard)
  @Mutation(() => BoardType)
  async move(@Username() author: string, @Args("roomName") roomName: string, @Args("token") tokenInput: TokenType): Promise<BoardType> {
    const token = new Token(new Position(tokenInput.position), new Size(tokenInput.size), tokenInput.imageSrc, new CharacterIdentity(tokenInput.id.name,tokenInput.id.owner, tokenInput.id.adventure))

    await this.moveTokenCommandHandler.handle({author, token, roomName})

    return this.board(roomName)
  }
}
