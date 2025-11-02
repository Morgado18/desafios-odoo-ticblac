import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompanyAddressService } from './company-address.service';
import { CreateCompanyAddressDto } from './dto/create-company-address.dto';
import { UpdateCompanyAddressDto } from './dto/update-company-address.dto';

@Controller('company-address')
export class CompanyAddressController {
  constructor(private readonly companyAddressService: CompanyAddressService) {}

  @Post()
  create(@Body() createCompanyAddressDto: CreateCompanyAddressDto) {
    return this.companyAddressService.create(createCompanyAddressDto);
  }

  @Get()
  findAll() {
    return this.companyAddressService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyAddressService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyAddressDto: UpdateCompanyAddressDto) {
    return this.companyAddressService.update(+id, updateCompanyAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyAddressService.remove(+id);
  }
}
