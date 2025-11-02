import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteScheduleDto } from './create-route-schedule.dto';

export class UpdateRouteScheduleDto extends PartialType(CreateRouteScheduleDto) {}
