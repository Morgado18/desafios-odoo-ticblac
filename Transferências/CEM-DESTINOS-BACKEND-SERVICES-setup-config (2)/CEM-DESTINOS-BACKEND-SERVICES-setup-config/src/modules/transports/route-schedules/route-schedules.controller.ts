import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RouteSchedulesService } from './route-schedules.service';
import { CreateRouteScheduleDto } from './dto/create-route-schedule.dto';
import { UpdateRouteScheduleDto } from './dto/update-route-schedule.dto';

@Controller('route-schedules')
export class RouteSchedulesController {
  constructor(private readonly service: RouteSchedulesService) {}

  @Post()
  create(@Body() dto: CreateRouteScheduleDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRouteScheduleDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
