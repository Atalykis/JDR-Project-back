import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthenticateUserHandler } from "../application/authenticate-user.command";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticateUserHandler: AuthenticateUserHandler) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = this.authenticateUserHandler.handle({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
