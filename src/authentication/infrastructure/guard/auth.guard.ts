import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { TokenManager } from "../../application/token-manager";

export class AuthGuard implements CanActivate {
  constructor(private readonly tokenManager: TokenManager) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const user = this.tokenManager.getUsernameFromAccessToken(request.headers.authorization);
      console.log(user);
    }
    return true;
  }
}
