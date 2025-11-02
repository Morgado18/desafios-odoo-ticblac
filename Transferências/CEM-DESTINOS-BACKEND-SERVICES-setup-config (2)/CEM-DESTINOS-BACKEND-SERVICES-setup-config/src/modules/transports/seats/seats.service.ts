import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seat } from './entities/seat.entity';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Injectable()
export class SeatsService {
  constructor(
    @InjectRepository(Seat)
    private readonly repo: Repository<Seat>,
  ) {}

  async create(dto: CreateSeatDto) {
    const seat = this.repo.create(dto);
    return await this.repo.save(seat);
  }

  async findAll() {
    return await this.repo.find({ relations: ['schedule'] });
  }

  async findOne(id: number) {
    const seat = await this.repo.findOne({
      where: { id: id.toString() },
      relations: ['schedule'],
    });
    if (!seat) throw new NotFoundException(`Seat #${id} not found`);
    return seat;
  }

  async update(id: number, dto: UpdateSeatDto) {
    const seat = await this.findOne(id);
    Object.assign(seat, dto);
    return await this.repo.save(seat);
  }

  async remove(id: number) {
    const seat = await this.findOne(id);
    await this.repo.remove(seat);
    return { deleted: true };
  }

  // get seat available
  async findAvailableBySchedule(scheduleId: number) {
    return await this.repo.find({
      where: { schedule_id: scheduleId.toString(), is_occupied: false },
    });
  }
}
