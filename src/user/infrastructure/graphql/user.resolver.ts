import { ConflictException, Inject, UseGuards } from "@nestjs/common";
import { Args, Field, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { AuthenticateUserHandler } from "../../application/authenticate-user.command/authenticate-user.command";
import { CannotCreateUserWithAlreadyTakenUsernameError, RegisterUserHandler } from "../../application/register-user.command/register-user.command";
import { UserStore } from "../../application/user.store";
import { AuthGuard, Username } from "../guard/auth.guard";

@ObjectType("User")
class UserType {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType("Token")
class TokenType {
  @Field()
  token: string;
}

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    @Inject("UserStore") private readonly userStore: UserStore,
    private readonly authenticateUserHandler: AuthenticateUserHandler,
    private readonly registerUserHandler: RegisterUserHandler
  ) {}

  @UseGuards(AuthGuard)
  @Query(() => UserType)
  async user(@Args("username") username: string) {
    return this.userStore.load(username);
  }

  @Mutation(() => UserType)
  async register(@Args("username") username: string, @Args("password") password: string) {
    try {
      await this.registerUserHandler.handle({ username, password });
      return this.user(username);
    } catch (error) {
      if (error instanceof CannotCreateUserWithAlreadyTakenUsernameError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Mutation(() => TokenType)
  async login(@Args("username") username: string, @Args("password") password: string) {
    try {
      return {
        token: await this.authenticateUserHandler.handle({ username, password }),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }
}
