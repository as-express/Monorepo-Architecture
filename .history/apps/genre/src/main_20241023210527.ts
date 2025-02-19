import { NestFactory } from '@nestjs/core';
import { GenreModule } from './genre.module';
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(GenreModule);
  await app.listen(process.env.port ?? 8003);
}

bootstrap();

