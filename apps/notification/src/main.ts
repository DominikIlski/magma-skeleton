import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { RmqService } from '@app/common/rabbitMQ';
import { NOTIFICATION_SERVICE } from 'libs/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(NOTIFICATION_SERVICE));
  await app.startAllMicroservices();
}
bootstrap();
