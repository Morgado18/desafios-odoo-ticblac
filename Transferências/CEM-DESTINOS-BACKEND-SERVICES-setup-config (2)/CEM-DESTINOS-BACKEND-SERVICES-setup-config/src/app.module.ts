import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportsModule } from './modules/transports/transports.module';

// Entities
import { Location } from './modules/transports/locations/entities/location.entity';
import { Company } from './modules/transports/companies/entities/company.entity';
import { Route } from './modules/transports/routes/entities/route.entity';
import { RouteSchedule } from './modules/transports/route-schedules/entities/route-schedule.entity';
import { Seat } from './modules/transports/seats/entities/seat.entity';
import { Passenger } from './modules/transports/passengers/entities/passenger.entity';
import { Ticket } from './modules/transports/tickets/entities/ticket.entity';
import { Payment } from './modules/transports/payments/entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [
          Location, Company, Route, RouteSchedule,
          Seat, Passenger, Ticket, Payment
        ],
        synchronize: config.get('TYPEORM_SYNC') === 'true',
        logging: config.get('TYPEORM_LOGGING') === 'true',
      }),
    }),
    TransportsModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
