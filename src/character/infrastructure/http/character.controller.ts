// import { Body, ConflictException, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards, ValidationPipe } from "@nestjs/common";
// import {
//   CannotCreateCharacterWithAlreadyTakenNameForUserError,
//   CreateCharacterHandler,
// } from "../../application/create-character.command/create-character.comand";
// import { GetCharactersHandler } from "../../application/get-characters.query/get-characters.query";
// import { AuthGuard, Username } from "../../../user/infrastructure/guard/auth.guard";
// import { IsString, MaxLength, MinLength } from "class-validator";

// class CreateCharacterDto {
//   @IsString()
//   @MinLength(5)
//   @MaxLength(30)
//   name!: string;

//   @IsString()
//   @MinLength(5)
//   @MaxLength(200)
//   description!: string;

//   @IsString()
//   @MinLength(5)
//   @MaxLength(30)
//   adventure!: string;
// }

// class GetCharactersDto {
//   @IsString()
//   @MinLength(5)
//   @MaxLength(30)
//   adventure!: string;
// }

// @Controller()
// export class CharacterController {
//   constructor(private readonly createCharacterHandler: CreateCharacterHandler, private readonly getCharactersHandler: GetCharactersHandler) {}

//   @UseGuards(AuthGuard)
//   @Post("/character")
//   @HttpCode(HttpStatus.CREATED)
//   createCharacter(@Body(ValidationPipe) { name, description, adventure }: CreateCharacterDto, @Username() username: string) {
//     try {
//       return this.createCharacterHandler.handle({ name, user: username, description, adventure });
//     } catch (error) {
//       if (error instanceof CannotCreateCharacterWithAlreadyTakenNameForUserError) {
//         throw new ConflictException(error.message);
//       }
//       throw error;
//     }
//   }

//   @UseGuards(AuthGuard)
//   @Get("/characters")
//   getCharacters(@Query(ValidationPipe) { adventure }: GetCharactersDto, @Username() owner: string) {
//     try {
//       const characters = this.getCharactersHandler.handle({ owner, adventure });
//       return characters;
//     } catch (error) {
//       throw error;
//     }
//   }
// }
