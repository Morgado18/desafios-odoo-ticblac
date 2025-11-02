import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvailableServiceService } from './available-service.service';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';

@Controller('available-service')
export class AvailableServiceController {
  constructor(private readonly availableServiceService: AvailableServiceService) {}

  @Post()
  create(@Body() createAvailableServiceDto: CreateAvailableServiceDto) {
    return this.availableServiceService.create(createAvailableServiceDto);
  }

  @Get()
  findAll() {
    return this.availableServiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availableServiceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvailableServiceDto: UpdateAvailableServiceDto) {
    return this.availableServiceService.update(+id, updateAvailableServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availableServiceService.remove(+id);
  }
}
