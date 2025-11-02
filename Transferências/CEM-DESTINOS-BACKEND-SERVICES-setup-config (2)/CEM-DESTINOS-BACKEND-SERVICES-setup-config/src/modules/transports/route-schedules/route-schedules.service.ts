import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteSchedule } from './entities/route-schedule.entity';
import { CreateRouteScheduleDto } from './dto/create-route-schedule.dto';
import { UpdateRouteScheduleDto } from './dto/update-route-schedule.dto';

@Injectable()
export class RouteSchedulesService {
  constructor(
    @InjectRepository(RouteSchedule)
    private readonly repo: Repository<RouteSchedule>,
  ) {}

  async create(dto: CreateRouteScheduleDto) {
    const schedule = this.repo.create(dto);
    return await this.repo.save(schedule);
  }

  async findAll() {
    return await this.repo.find({ relations: ['route'] });
  }

  async findOne(id: number) {
    const schedule = await this.repo.findOne({
      where: { id: id.toString() },
      relations: ['route'],
    });
    if (!schedule) throw new NotFoundException(`RouteSchedule #${id} not found`);
    return schedule;
  }

  async update(id: number, dto: UpdateRouteScheduleDto) {
    const schedule = await this.findOne(id);
    Object.assign(schedule, dto);
    return await this.repo.save(schedule);
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    await this.repo.remove(schedule);
    return { deleted: true };
  }
}
