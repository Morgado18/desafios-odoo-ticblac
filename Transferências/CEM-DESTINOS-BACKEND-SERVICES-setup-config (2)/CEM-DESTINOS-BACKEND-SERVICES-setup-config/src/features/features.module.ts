import { Module } from "@nestjs/common";
import { ServiceModule } from './service/service.module';
import { ProfileModule } from './profile/profile.module';
import { AvailableServiceModule } from './available-service/available-service.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ClientModule } from './client/client.module';
import { PhotoModule } from './photo/photo.module';
import { CompanyModule } from './company/company.module';
import { CouponModule } from './coupon/coupon.module';
import { PromotionModule } from './promotion/promotion.module';
import { CompanyAddressModule } from './company-address/company-address.module';
import { AddressModule } from './address/address.module';
import { ContactModule } from './contact/contact.module';
import { ContactTypeModule } from './contact-type/contact-type.module';
import { ServiceHistoryModule } from './service-history/service-history.module';
import { CompaniesModule } from '../modules/transports/companies/companies.module';

@Module({
    imports: [
        ServiceModule,
        ProfileModule,
        AvailableServiceModule,
        RoleModule,
        ClientModule,
        PermissionModule,
        PhotoModule,
        CompanyModule,
        CouponModule,
        PromotionModule,
        CompanyAddressModule,
        AddressModule,
        ContactModule,
        ContactTypeModule,
        ServiceHistoryModule, CompaniesModule,
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class FeaturesModule {}
