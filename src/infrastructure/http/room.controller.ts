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
  ValidationPipe,
} from "@nestjs/common";
import { IsString, MinLength, MaxLength } from "class-validator";
import { CannotCreateRoomWithAlreadyTakenNameError, CreateRoomHandler } from "../../application/create-room.command";
import { CannotGetMembersOfNonExistingRoom, GetRoomMembersHandler } from "../../application/get-room-members.query";
import { CannotJoinAleadyJoinedRoomError, CannotJoinUnexistingRoomError, JoinRoomHandler } from "../../application/join-room.command";
import { CannotLeaveUnexistingRoomError, CannotLeaveUnjoinedRoomError, LeaveRoomHandler } from "../../application/leave-room.command";

class CreateRoomInputDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name!: string;
}

class RoomAndUserInputDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  room!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  user!: string;
}

class GetRoomMembersDto {
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  room!: string;
}

class JoinRoomInputDto extends RoomAndUserInputDto {}
class LeaveRoomInputDto extends RoomAndUserInputDto {}

@Controller()
export class RoomController {
  constructor(
    private readonly createRoomHandler: CreateRoomHandler,
    private readonly joinRoomHandler: JoinRoomHandler,
    private readonly leaveRoomHandler: LeaveRoomHandler,
    private readonly getRoomMembersHandler: GetRoomMembersHandler
  ) {}

  @Post("/room")
  createRoom(@Body(ValidationPipe) { name }: CreateRoomInputDto) {
    try {
      return this.createRoomHandler.handle({ name });
    } catch (error) {
      if (error instanceof CannotCreateRoomWithAlreadyTakenNameError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Post("/join")
  @HttpCode(HttpStatus.NO_CONTENT)
  joinRoom(@Body(ValidationPipe) { room, user }: JoinRoomInputDto) {
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

  @Post("/leave")
  @HttpCode(HttpStatus.NO_CONTENT)
  leaveRoom(@Body(ValidationPipe) { room, user }: LeaveRoomInputDto) {
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

  @Get("/members")
  getMembers(@Body(ValidationPipe) { room }: GetRoomMembersDto) {
    try {
      return this.getRoomMembersHandler.handle({ room });
    } catch (error) {
      if (error instanceof CannotGetMembersOfNonExistingRoom) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
