import { Injectable } from '@nestjs/common';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';

@Injectable()
export class AvailableServiceService {
  create(createAvailableServiceDto: CreateAvailableServiceDto) {
    return 'This action adds a new availableService';
  }

  findAll() {
    return `This action returns all availableService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} availableService`;
  }

  update(id: number, updateAvailableServiceDto: UpdateAvailableServiceDto) {
    return `This action updates a #${id} availableService`;
  }

  remove(id: number) {
    return `This action removes a #${id} availableService`;
  }
}
