import { NestFactory } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { UserModule } from "./user/infrastructure/user.module";
import { RoomModule } from "./room/infrastructure/room.module";
import { CharacterModule } from "./character/character.module";

@Module({
  imports: [UserModule, RoomModule, CharacterModule],
})
class BackendModule {}

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.enableCors({ origin: "*" });
  app.listen(3000);
}

bootstrap();
