import { Module } from '@nestjs/common';
import { AvailableServiceService } from './available-service.service';
import { AvailableServiceController } from './available-service.controller';

@Module({
  controllers: [AvailableServiceController],
  providers: [AvailableServiceService],
})
export class AvailableServiceModule {}
