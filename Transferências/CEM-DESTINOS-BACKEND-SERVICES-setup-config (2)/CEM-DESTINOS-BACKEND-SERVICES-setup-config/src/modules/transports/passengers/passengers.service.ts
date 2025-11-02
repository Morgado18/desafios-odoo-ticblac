import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from './entities/passenger.entity';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private readonly repo: Repository<Passenger>,
  ) {}

  async create(dto: CreatePassengerDto) {
    const passenger = this.repo.create(dto);
    return await this.repo.save(passenger);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const passenger = await this.repo.findOneBy({ id: id.toString() });
    if (!passenger) throw new NotFoundException(`Passenger #${id} not found`);
    return passenger;
  }

  async update(id: number, dto: UpdatePassengerDto) {
    const passenger = await this.findOne(id);
    Object.assign(passenger, dto);
    return await this.repo.save(passenger);
  }

  async remove(id: number) {
    const passenger = await this.findOne(id);
    await this.repo.remove(passenger);
    return { deleted: true };
  }

  async findByUserId(userId: number) {
    return await this.repo.find({ where: { user_id: userId.toString() } });
  }
}
