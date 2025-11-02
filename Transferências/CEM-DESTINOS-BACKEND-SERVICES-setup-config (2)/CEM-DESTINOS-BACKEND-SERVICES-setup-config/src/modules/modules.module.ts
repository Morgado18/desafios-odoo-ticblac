import { Module } from "@nestjs/common";
import { CompaniesModule } from './transports/companies/companies.module';

@Module({
    imports: [CompaniesModule],
    controllers: [],
    providers: [],
    exports: []
})
export class ModulesModule {}
