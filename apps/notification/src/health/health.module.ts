import { Module, forwardRef } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common/rabbitMQ';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => RmqModule),
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
