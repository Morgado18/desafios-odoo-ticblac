import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceHistoryService } from './service-history.service';
import { CreateServiceHistoryDto } from './dto/create-service-history.dto';
import { UpdateServiceHistoryDto } from './dto/update-service-history.dto';

@Controller('service-history')
export class ServiceHistoryController {
  constructor(private readonly serviceHistoryService: ServiceHistoryService) {}

  @Post()
  create(@Body() createServiceHistoryDto: CreateServiceHistoryDto) {
    return this.serviceHistoryService.create(createServiceHistoryDto);
  }

  @Get()
  findAll() {
    return this.serviceHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceHistoryDto: UpdateServiceHistoryDto) {
    return this.serviceHistoryService.update(+id, updateServiceHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceHistoryService.remove(+id);
  }
}
