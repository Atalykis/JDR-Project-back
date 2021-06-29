import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { IsString, MinLength, MaxLength } from "class-validator";
import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
import { CannotCreateRoomWithAlreadyTakenNameError, CreateRoomHandler } from "../../application/create-room.command";
import { CannotGetPlayersOfNonExistingRoom, GetRoomPlayersHandler } from "../../application/get-room-players.query";
import { CannotJoinAleadyJoinedRoomError, CannotJoinUnexistingRoomError, JoinRoomHandler } from "../../application/join-room.command";
import { CannotKickPlayerIfNotMjError, CannotKickPlayerOutsideARoomError, KickPlayerHandler } from "../../application/kick-player.command";
import { CannotLeaveUnexistingRoomError, CannotLeaveUnjoinedRoomError, LeaveRoomHandler } from "../../application/leave-room.command";

class CreateRoomInputDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name!: string;
}

class RoomInputDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  room!: string;
}

class KickPlayerDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  player!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  room!: string;
}

class GetRoomPlayersDto extends RoomInputDto {}

class JoinRoomInputDto extends RoomInputDto {}

class LeaveRoomInputDto extends RoomInputDto {}

@Controller()
export class RoomController {
  constructor(
    private readonly createRoomHandler: CreateRoomHandler,
    private readonly joinRoomHandler: JoinRoomHandler,
    private readonly leaveRoomHandler: LeaveRoomHandler,
    private readonly getRoomPlayersHandler: GetRoomPlayersHandler,
    private readonly kickPlayerHandler: KickPlayerHandler
  ) {}

  @UseGuards(AuthGuard)
  @Post("/room")
  createRoom(@Body(ValidationPipe) { name }: CreateRoomInputDto, @Username() username: string) {
    try {
      return this.createRoomHandler.handle({ name, mj: username });
    } catch (error) {
      if (error instanceof CannotCreateRoomWithAlreadyTakenNameError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post("/join")
  @HttpCode(HttpStatus.NO_CONTENT)
  joinRoom(@Body(ValidationPipe) { room }: JoinRoomInputDto, @Username() user: string) {
    try {
      this.joinRoomHandler.handle({ room, user });
    } catch (error) {
      if (error instanceof CannotJoinAleadyJoinedRoomError) {
        throw new ConflictException(error.message);
      }
      if (error instanceof CannotJoinUnexistingRoomError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Post("/leave")
  @HttpCode(HttpStatus.NO_CONTENT)
  leaveRoom(@Body(ValidationPipe) { room }: LeaveRoomInputDto, @Username() user: string) {
    try {
      this.leaveRoomHandler.handle({ room, user });
    } catch (error) {
      if (error instanceof CannotLeaveUnjoinedRoomError) {
        throw new ForbiddenException(error.message);
      }
      if (error instanceof CannotLeaveUnexistingRoomError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get("/players")
  getPlayers(@Body(ValidationPipe) { room }: GetRoomPlayersDto) {
    try {
      return this.getRoomPlayersHandler.handle({ room });
    } catch (error) {
      if (error instanceof CannotGetPlayersOfNonExistingRoom) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("/kick")
  kickPlayer(@Body(ValidationPipe) { player, room }: KickPlayerDto, @Username() originator: string) {
    try {
      this.kickPlayerHandler.handle({ player, room, originator });
    } catch (error) {
      if (error instanceof CannotKickPlayerIfNotMjError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
