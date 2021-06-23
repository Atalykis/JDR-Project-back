import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthenticateUserHandler } from "./application/authenticate-user.command";
import { RegisterUserHandler } from "./application/register-user.command";
import { UserStore } from "./application/user.store";
import { UserController } from "./infrastructure/http/user.controller";
import { LocalStrategy } from "./infrastructure/local.strategy";
import { UserStoreInMemory } from "./infrastructure/user.store.in-memory";

@Module({
  controllers: [UserController],
  imports: [PassportModule],
  providers: [
    { provide: "UserStore", useClass: UserStoreInMemory },
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
    LocalStrategy,
  ],
})
export class UserModule {}
