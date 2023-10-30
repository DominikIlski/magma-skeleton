import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { RmqService } from '@app/common/rabbitMQ';
import { NOTIFICATION_SERVICE } from 'libs/common/constants/services';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get(ConfigService);
  const port = configService.get('NOTIFICATION_SERVICE_PORT');
  console.log(`Listening on port ${port}`);
  if (!port) {
    throw new Error('USERS_SERVICE_PORT is not defined');
  }
  app.connectMicroservice(rmqService.getOptions(NOTIFICATION_SERVICE));

  app.enableShutdownHooks();
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
