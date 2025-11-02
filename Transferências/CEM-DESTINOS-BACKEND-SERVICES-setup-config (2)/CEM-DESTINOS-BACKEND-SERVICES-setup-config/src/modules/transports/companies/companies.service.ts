import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) {}

  async create(dto: CreateCompanyDto) {
    const company = this.repo.create(dto);
    return await this.repo.save(company);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    const company = await this.repo.findOneBy({ id: id.toString() });
    if (!company) throw new NotFoundException(`Company #${id} not found`);
    return company;
  }

  async update(id: number, dto: UpdateCompanyDto) {
    const company = await this.findOne(id);
    Object.assign(company, dto);
    return await this.repo.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    await this.repo.remove(company);
    return { deleted: true };
  }
}
