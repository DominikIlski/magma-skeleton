import { AbstractBaseController } from '@app/common/abstracts';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  HealthCheck,
  MicroserviceHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController extends AbstractBaseController {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator,
    private memory: MemoryHealthIndicator,
    private configService: ConfigService,
  ) {
    super();
  }

  @Get()
  @HealthCheck()
  check() {
    const rmqUri = this.configService.get<string>('RABBIT_MQ_URI');
    if (!rmqUri) {
      throw new Error('RABBIT_MQ_URI not found');
    }
    return this.health.check([
      async () =>
        this.microservice.pingCheck<RmqOptions>('rmq', {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUri],
          },
        }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
