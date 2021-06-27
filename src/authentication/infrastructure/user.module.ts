import { Module } from "@nestjs/common";

import { AuthenticateUserHandler } from "../application/authenticate-user.command";
import { RegisterUserHandler } from "../application/register-user.command";
import { TokenManager } from "../application/token-manager";
import { AuthGuard } from "./guard/auth.guard";
import { UserController } from "./http/user.controller";
import { UserStore } from "./store/user.store";
import { UserStoreInMemory } from "./store/user.store.in-memory";
import { CryptrTokenManager } from "./token/crypto.token-manager";

@Module({
  controllers: [UserController],
  providers: [
    { provide: "UserStore", useClass: UserStoreInMemory },
    { provide: "TokenManager", useFactory: () => new CryptrTokenManager("my_super_secret_key") },
    {
      provide: RegisterUserHandler,
      useFactory: (userStore: UserStore) => new RegisterUserHandler(userStore),
      inject: ["UserStore"],
    },
    {
      provide: AuthenticateUserHandler,
      useFactory: (userStore: UserStore) => new AuthenticateUserHandler(userStore),
      inject: ["UserStore"],
    },
  ],
  exports: ["TokenManager"],
})
export class UserModule {}
