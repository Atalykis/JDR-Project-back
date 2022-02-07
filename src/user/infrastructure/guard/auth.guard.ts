import { CanActivate, createParamDecorator, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { TokenManager } from "../../application/token-manager";

export const Username = createParamDecorator((_data: any, ctx: ExecutionContext) => {
  let request = ctx.switchToHttp().getRequest();
  if (!request) {
    const { req } = GqlExecutionContext.create(ctx).getContext();
    request = req;
  }
  const username = request.username;
  return username;
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject("TokenManager") private readonly tokenManager: TokenManager) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    let request = context.switchToHttp().getRequest();
    if (!request) {
      const { req } = GqlExecutionContext.create(context).getContext();
      request = req;
    }
    if (request.headers.authorization) {
      try {
        const username = this.tokenManager.getUsernameFromAccessToken(request.headers.authorization);
        request.username = username;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return true;
  }
}
