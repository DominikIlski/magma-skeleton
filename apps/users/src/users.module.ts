import { Module } from '@nestjs/common';
import * as yup from 'yup';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database/mongodb.module';
import { UserRepository } from './users.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: yup.object({
        MONGODB_URI: yup.string().required(),
        PORT: yup.number().required(),
      }),
      envFilePath: './apps/users/.env',
    }),
    DatabaseModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
