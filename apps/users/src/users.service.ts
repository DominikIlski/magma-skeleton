import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { PageOptionsDto } from '@app/common/pagination';
import { RetrunAllUsers } from './dto/return_all_users.dto';
import { ReturnUserDto } from './dto/return_user.dto';
import { plainToInstance } from 'class-transformer';
import { NOTIFICATION_SERVICE } from '../../../libs/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { NotificationMessageDto } from 'apps/notification/src/dto/notification.dto';
import { NotificationMessageType } from 'apps/notification/src/constants/message_type.enum';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<RetrunAllUsers> {
    return this.userRepository.getAllWithPagination(pageOptionsDto);
  }

  async findById(id: string): Promise<ReturnUserDto> {
    const userEntity = await this.userRepository.findById(id);
    return plainToInstance(ReturnUserDto, userEntity);
  }

  async create(userDto: CreateUserDto): Promise<ReturnUserDto> {
    const existingUser = await this.userRepository.findByEmail(userDto.email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const session = await this.userRepository.startTransaction();

    try {
      const userEntity = await this.userRepository.create(userDto, { session });
      const notificationMessage: NotificationMessageDto = {
        message: 'User created',
        email: userEntity.email,
        name: userEntity.name,
      };
      await this.sendNotification(
        NotificationMessageType.CREATE_USER,
        notificationMessage,
      );
      await session.commitTransaction();

      return plainToInstance(ReturnUserDto, userEntity);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  async update(id: string, user: UpdateUserDto): Promise<ReturnUserDto> {
    const userEntity = await this.userRepository.update(id, user);
    return plainToInstance(ReturnUserDto, userEntity);
  }

  async delete(id: string): Promise<boolean> {
    const session = await this.userRepository.startTransaction();
    const userEntity = await this.userRepository.findById(id);
    try {
      const result = await this.userRepository.delete(id, session);
      const notificationMessage: NotificationMessageDto = {
        message: 'User deleted',
        email: userEntity.email,
        name: userEntity.name,
      };
      await this.sendNotification(
        NotificationMessageType.CREATE_USER,
        notificationMessage,
      );
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }
  private async sendNotification(
    messageType: NotificationMessageType,
    data: NotificationMessageDto,
  ) {
    return await lastValueFrom(
      this.notificationService.emit(messageType, data),
    );
  }
}
