import { Injectable } from '@nestjs/common';
import { CreateServiceHistoryDto } from './dto/create-service-history.dto';
import { UpdateServiceHistoryDto } from './dto/update-service-history.dto';

@Injectable()
export class ServiceHistoryService {
  create(createServiceHistoryDto: CreateServiceHistoryDto) {
    return 'This action adds a new serviceHistory';
  }

  findAll() {
    return `This action returns all serviceHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceHistory`;
  }

  update(id: number, updateServiceHistoryDto: UpdateServiceHistoryDto) {
    return `This action updates a #${id} serviceHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceHistory`;
  }
}
