
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  async findByUuid(uuid: string): Promise<Company | null> {
    return this.findOne({ where: { uuid }, relations: ['routes'] });
  }

  async findByName(name: string): Promise<Company | null> {
    return this.findOne({ where: { name }, relations: ['routes'] });
  }
}
