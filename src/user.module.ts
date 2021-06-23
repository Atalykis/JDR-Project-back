import { Module } from "@nestjs/common";
import { RegisterUserHandler } from "./application/register.command";
import { UserStore } from "./application/user.store";
import { UserController } from "./infrastructure/http/user.controller";
import { UserStoreInMemory } from "./infrastructure/user.store.in-memory";


@Module({
  controllers: [UserController],
  providers: [
    { provide: "UserStore", useClass: UserStoreInMemory },
    {
			provide: RegisterUserHandler,
			useFactory: (userStore: UserStore) => new RegisterUserHandler(userStore),
			inject: ["UserStore"],
		},
  ],
})
export class UserModule {} 