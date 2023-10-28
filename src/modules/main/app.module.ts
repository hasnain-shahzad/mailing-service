import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BullModule } from "@nestjs/bull";
import { EnQueueName } from "modules/queue/common/queue.enums";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Mail } from "./mail.entity";
import { LoggerModule } from "../../utils/logger/logger.module";
import { QueueModule } from "modules/queue/queue.module";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => {
                return await AppService.createConnection();
            },
        }),
        TypeOrmModule.forFeature([Mail]),
        ConfigModule.forRoot({
            envFilePath: [AppService.envConfiguration()],
        }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD
            }
        }),
        BullModule.registerQueueAsync({
            name: EnQueueName.MAILING,
        }),
        QueueModule,
        LoggerModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
