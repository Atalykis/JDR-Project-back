import { NestFactory } from "@nestjs/core";
import { BackendModule } from "./backend.module";
import { MongoDbClient } from "./character/infrastructure/mongodb/mongodb.client";

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);
  app.enableCors({ origin: "*" });
  app.listen(3000);
}

bootstrap();
