import { Module } from '@nestjs/common';
import * as yup from 'yup';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';

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
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
