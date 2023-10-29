import { Module } from '@nestjs/common';
import * as yup from 'yup';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database/mongodb.module';
import { UserRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_URI } from '@app/common';
import { RmqModule } from '@app/common/rabbitMQ';
import { NOTIFICATION_SERVICE } from '../../../libs/common/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: yup.object({
        MONGO_INITDB_ROOT_USERNAME: yup.string().required(),
        MONGO_INITDB_ROOT_PASSWORD: yup.string().required(),
        USERS_SERVICE_PORT: yup.number().required(),
        MONGO_INITDB_DATABASE: yup.string().required(),
        MONGODB_REPLICA_SET_KEY: yup.string().required(),
        MONGODB_PRIMARY_NAME: yup.string().required(),
        MONGODB_SECONDARY_NAME: yup.string().required(),
        MONGODB_PORT: yup.number().required(),
      }),
      envFilePath: '.env',
      load: [MONGODB_URI],
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RmqModule.register({ queueName: NOTIFICATION_SERVICE }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
