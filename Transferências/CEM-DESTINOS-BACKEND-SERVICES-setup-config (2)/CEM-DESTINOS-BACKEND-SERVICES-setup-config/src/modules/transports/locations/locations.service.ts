import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  create(dto: CreateLocationDto) {
    const location = this.locationRepo.create(dto);
    return this.locationRepo.save(location);
  }

  findAll() {
    return this.locationRepo.find();
  }

  async findOne(id: number) {
    const location = await this.locationRepo.findOneBy({ id: id.toString() });
    if (!location) throw new NotFoundException(`Location #${id} not found`);
    return location;
  }

  async update(id: number, dto: UpdateLocationDto) {
    const location = await this.findOne(id);
    Object.assign(location, dto);
    return this.locationRepo.save(location);
  }

  async remove(id: number) {
    const location = await this.findOne(id);
    await this.locationRepo.remove(location);
    return { deleted: true };
  }
}
