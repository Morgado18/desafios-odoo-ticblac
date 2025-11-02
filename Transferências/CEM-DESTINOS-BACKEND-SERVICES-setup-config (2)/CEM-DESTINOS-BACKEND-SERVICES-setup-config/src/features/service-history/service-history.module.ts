import { Module } from '@nestjs/common';
import { ServiceHistoryService } from './service-history.service';
import { ServiceHistoryController } from './service-history.controller';

@Module({
  controllers: [ServiceHistoryController],
  providers: [ServiceHistoryService],
})
export class ServiceHistoryModule {}
