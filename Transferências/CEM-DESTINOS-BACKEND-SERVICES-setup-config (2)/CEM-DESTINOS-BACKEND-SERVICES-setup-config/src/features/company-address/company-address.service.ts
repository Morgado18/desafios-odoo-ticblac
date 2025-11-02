import { Injectable } from '@nestjs/common';
import { CreateCompanyAddressDto } from './dto/create-company-address.dto';
import { UpdateCompanyAddressDto } from './dto/update-company-address.dto';

@Injectable()
export class CompanyAddressService {
  create(createCompanyAddressDto: CreateCompanyAddressDto) {
    return 'This action adds a new companyAddress';
  }

  findAll() {
    return `This action returns all companyAddress`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyAddress`;
  }

  update(id: number, updateCompanyAddressDto: UpdateCompanyAddressDto) {
    return `This action updates a #${id} companyAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyAddress`;
  }
}
