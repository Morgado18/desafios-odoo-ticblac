import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactTypeService } from './contact-type.service';
import { CreateContactTypeDto } from './dto/create-contact-type.dto';
import { UpdateContactTypeDto } from './dto/update-contact-type.dto';

@Controller('contact-type')
export class ContactTypeController {
  constructor(private readonly contactTypeService: ContactTypeService) {}

  @Post()
  create(@Body() createContactTypeDto: CreateContactTypeDto) {
    return this.contactTypeService.create(createContactTypeDto);
  }

  @Get()
  findAll() {
    return this.contactTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactTypeDto: UpdateContactTypeDto) {
    return this.contactTypeService.update(+id, updateContactTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactTypeService.remove(+id);
  }
}
