import { Module } from "@nestjs/common";
import { AuthenticateUserHandler } from "../application/authenticate-user.command/authenticate-user.command";
import { GetUserInfoQueryHandler } from "../application/get-user-info.query/get-user-info.query";
import { RegisterUserHandler } from "../application/register-user.command/register-user.command";

import { TokenManager } from "../application/token-manager";
import { UserStore } from "../application/user.store";
import { AuthGuard } from "./guard/auth.guard";
import { UserController } from "./http/user.controller";
import { UserStoreInMemory } from "./store/user.store.in-memory";
import { CryptrTokenManager } from "./token/crypto.token-manager";

@Module({
  controllers: [UserController],
  providers: [
    { provide: "UserStore", useClass: UserStoreInMemory },
    { provide: "TokenManager", useFactory: () => new CryptrTokenManager("my_super_secret_key") },
    {
      provide: RegisterUserHandler,
      useFactory: (userStore: UserStore, tokenManager: TokenManager) => new RegisterUserHandler(userStore, tokenManager),
      inject: ["UserStore", "TokenManager"],
    },
    {
      provide: AuthenticateUserHandler,
      useFactory: (userStore: UserStore, tokenManager: TokenManager) => new AuthenticateUserHandler(userStore, tokenManager),
      inject: ["UserStore", "TokenManager"],
    },
    {
      provide: GetUserInfoQueryHandler,
      useFactory: (tokenManager: TokenManager) => new GetUserInfoQueryHandler(tokenManager),
      inject: ["TokenManager"],
    },
  ],
  exports: ["TokenManager"],
})
export class UserModule {}
