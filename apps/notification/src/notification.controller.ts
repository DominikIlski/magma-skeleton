import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotificationMessageDto } from './dto/notification.dto';
import { NotificationMessageType } from './constants/message_type.enum';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(NotificationMessageType.CREATE_USER)
  handleUserCreated(
    @Payload() data: NotificationMessageDto,
    @Ctx() context: RmqContext,
  ) {
    this.notificationService.sendNotification(data, context);
  }

  @EventPattern(NotificationMessageType.DELETE_USER)
  handleUserDeleted(
    @Payload() data: NotificationMessageDto,
    @Ctx() context: RmqContext,
  ) {
    this.notificationService.sendNotification(data, context);
  }
}
