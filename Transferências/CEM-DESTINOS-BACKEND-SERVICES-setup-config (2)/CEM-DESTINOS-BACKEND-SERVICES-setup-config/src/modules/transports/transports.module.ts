import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { LocationsModule } from './locations/locations.module';
import { RoutesModule } from './routes/routes.module';
import { RouteSchedulesModule } from './route-schedules/route-schedules.module';
import { PassengersModule } from './passengers/passengers.module';
import { TicketsModule } from './tickets/tickets.module';
import { SeatsModule } from './seats/seats.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    CompaniesModule,
    LocationsModule,
    RoutesModule,
    RouteSchedulesModule,
    PassengersModule,
    TicketsModule,
    SeatsModule,
    PaymentsModule,
  ],
  exports: [
    CompaniesModule,
    LocationsModule,
    RoutesModule,
    RouteSchedulesModule,
    PassengersModule,
    TicketsModule,
    SeatsModule,
    PaymentsModule,
  ],
})
export class TransportsModule {}
