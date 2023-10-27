import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);
  const port = configService.get('USERS_SERVICE_PORT');
  console.log(`Listening on port ${port})}`);
  if (!port) {
    throw new Error('USERS_SERVICE_PORT is not defined');
  }
  await app.listen(port);
}
bootstrap();
