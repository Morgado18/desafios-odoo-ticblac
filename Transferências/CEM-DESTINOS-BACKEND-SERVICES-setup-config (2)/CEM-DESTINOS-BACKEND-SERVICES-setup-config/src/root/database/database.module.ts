import { Module } from "@nestjs/common";
import { data_source } from "./database.config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forRoot(data_source.options)],
})
export class DatabaseModule {}