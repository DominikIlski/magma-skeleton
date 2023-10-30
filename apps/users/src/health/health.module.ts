import { Module, forwardRef } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database/mongodb.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    forwardRef(() => DatabaseModule),
    forwardRef(() => ConfigModule),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
