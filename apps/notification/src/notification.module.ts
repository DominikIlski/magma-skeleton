import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RmqModule } from '@app/common/rabbitMQ';
import { ConfigModule } from '@nestjs/config';
import * as yup from 'yup';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: yup.object({
        RABBIT_MQ_URI: yup.string().required(),
        RABBIT_MQ_NOTIFICATION_QUEUE: yup.string().required(),
      }),
    }),
    RmqModule,
    HealthModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
