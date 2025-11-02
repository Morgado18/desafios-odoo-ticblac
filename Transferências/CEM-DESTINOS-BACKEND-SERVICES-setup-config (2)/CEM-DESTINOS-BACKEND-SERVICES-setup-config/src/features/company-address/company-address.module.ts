import { Module } from '@nestjs/common';
import { CompanyAddressService } from './company-address.service';
import { CompanyAddressController } from './company-address.controller';

@Module({
  controllers: [CompanyAddressController],
  providers: [CompanyAddressService],
})
export class CompanyAddressModule {}
