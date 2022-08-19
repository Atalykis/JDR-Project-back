// import {
//   Body,
//   ConflictException,
//   Controller,
//   ForbiddenException,
//   HttpCode,
//   HttpStatus,
//   Post,
//   UnauthorizedException,
//   UseGuards,
//   ValidationPipe,
// } from "@nestjs/common";
// import { IsString, MaxLength, MinLength } from "class-validator";
// import { AuthenticateUserHandler } from "../../application/authenticate-user.command/authenticate-user.command";
// import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterUserHandler } from "../../application/register-user.command/register-user.command";
// import { AuthGuard } from "../guard/auth.guard";

// class RegisterUserDto {
//   @IsString()
//   @MinLength(5)
//   @MaxLength(15)
//   username!: string;

//   @IsString()
//   @MinLength(3)
//   @MaxLength(30)
//   password!: string;
// }

// @Controller()
// export class UserController {
//   constructor(private readonly registerUserHandler: RegisterUserHandler, private readonly authenticateUserHandler: AuthenticateUserHandler) {}

//   @Post("/register")
//   registerUser(@Body(ValidationPipe) { username, password }: RegisterUserDto) {
//     try {
//       return this.registerUserHandler.handle({ username, password });
//     } catch (error) {
//       if (error instanceof CannotCreateUserWithAlreadyTakenUsernameError) {
//         throw new ConflictException(error.message);
//       }
//       throw error;
//     }
//   }

//   @Post("/login")
//   @HttpCode(HttpStatus.OK)
//   login(@Body() { username, password }: any) {
//     try {
//       return this.authenticateUserHandler.handle({ username, password });
//     } catch (error) {
//       if (error instanceof Error) {
//         throw new UnauthorizedException(error.message);
//       }
//       throw error;
//     }
//   }
// }
