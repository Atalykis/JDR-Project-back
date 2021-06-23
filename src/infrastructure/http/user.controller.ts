import { Body, ConflictException, Controller, Post, ValidationPipe } from "@nestjs/common";
import { IsString, MaxLength, MinLength } from "class-validator";
import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterUserHandler } from "../../application/register.command";


class registerUserDto{
    @IsString()
    @MinLength(5)
    @MaxLength(15)
    username!: string;
  
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    password!: string;
}
@Controller()
export class UserController {
    constructor(private readonly registerUserHandler: RegisterUserHandler) {}

    @Post("/register")
    registerUser(@Body(ValidationPipe) {username, password} : registerUserDto){
        try {
            this.registerUserHandler.handle({username, password});
        } catch (error) {
            if(error instanceof CannotCreateUserWithAlreadyTakenUsernameError){
                throw new ConflictException(error.message);
            }
            throw error
        }
    }
}