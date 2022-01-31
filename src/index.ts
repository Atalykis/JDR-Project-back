import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";

@Module({
  imports: [UserModule, RoomModule],
})
class BackendModule {}

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.enableCors({ origin: "*" });
  app.listen(3000);
}

bootstrap();
