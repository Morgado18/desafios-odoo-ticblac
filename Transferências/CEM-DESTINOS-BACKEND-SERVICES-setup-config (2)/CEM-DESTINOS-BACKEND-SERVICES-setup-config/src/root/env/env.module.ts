import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as path from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                path.join(process.cwd(), '.env'),           
            ],
        })
    ],
})
export class EnvModule {}