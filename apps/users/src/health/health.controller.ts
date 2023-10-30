import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MongooseHealthIndicator,
  MicroserviceHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly configService: ConfigService,
    private mongoose: MongooseHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const rmqUri = this.configService.get<string>('RABBIT_MQ_URI');
    if (!rmqUri) {
      throw new Error('RABBIT_MQ_URI or USERS_SERVICE_PORT not found');
    }
    return this.health.check([
      async () =>
        this.microservice.pingCheck<RmqOptions>('rmq', {
          transport: Transport.RMQ,
          options: {
            urls: [rmqUri],
          },
        }),
      async () => this.mongoose.pingCheck('mongodb'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }
}
