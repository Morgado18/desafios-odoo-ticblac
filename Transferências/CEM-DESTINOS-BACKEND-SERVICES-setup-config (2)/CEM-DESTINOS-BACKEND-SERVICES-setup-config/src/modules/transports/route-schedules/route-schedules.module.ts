import { Module } from '@nestjs/common';
import { RouteSchedulesService } from './route-schedules.service';
import { RouteSchedulesController } from './route-schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteSchedule } from './entities/route-schedule.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([RouteSchedule]),
    ],
  controllers: [RouteSchedulesController],
  providers: [RouteSchedulesService],
})
export class RouteSchedulesModule {}
