import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { HealthModule } from './common/health/health.module';
import { HealthModule } from './health/health.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [HealthModule],
})
export class CommonModule {}
