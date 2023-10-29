import { Injectable, Logger } from '@nestjs/common';
import { NotificationMessageDto } from './dto/notification.dto';
import { RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common/rabbitMQ';

@Injectable()
export class NotificationService {
  constructor(private rmqService: RmqService) {}
  private readonly logger = new Logger(NotificationService.name);
  sendNotification(data: NotificationMessageDto, context: RmqContext) {
    this.logger.log(data.message, data.email);
    console.log('context', context.getChannelRef);
    this.rmqService.ack(context);
  }
}
