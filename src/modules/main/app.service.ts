import { HttpException, Injectable } from "@nestjs/common";
import { NodeEnv, ResponseCode } from "../../utils/enums";
import { Repository } from "typeorm";
import { Mail } from "./mail.entity";
import { InjectRepository, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { Queue } from "bull";
import { InjectQueue } from '@nestjs/bull';
import { EnJob, EnJobDelay, EnJobRetry, EnQueueName } from "modules/queue/common/queue.enums";
import { createDatabase } from "typeorm-extension";

@Injectable()
export class AppService {
    constructor(
        @InjectRepository(Mail)
        private readonly mailRepository: Repository<Mail>,
        @InjectQueue(EnQueueName.MAILING)
        private readonly mailingQueue: Queue
    ) { }

    /**
     * Configures The App Environment
     * @returns
     */
    static envConfiguration(): string {
        switch (process.env.NODE_ENV) {
            case NodeEnv.TEST:
                return `_${NodeEnv.TEST}.env`;

            default:
                return `.env`;
        }
    }

    /**
   * Create Connection to Database on App Start
   * @returns
   */
    static async createConnection() {
        await createDatabase(
            { ifNotExist: true },
            {
                type: `postgres`,
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
            }
        );

        return {
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + "./../**/**.entity{.ts,.js}"],
            synchronize: process.env.DB_SYNC === `true`,
            extra: {
                connectionLimit: 5,
            },
            logging: false,
        } as TypeOrmModuleAsyncOptions;
    }

    /**
     * Save and send mail to email coming in request body
     * @param email 
     * @param name 
     */
    async sendMail(email: string, name: string) {
        try {
            const mail = new Mail().fromDto(name, email);
            const newMail = await this.mailRepository.save(mail);
            // Add mail job to Mailing Queue
            await this.mailingQueue.add(
                EnJob.SEND_EMAIL,
                {
                    mailId: newMail.uuid,
                },
                {
                    delay: EnJobDelay.ONE_SECOND,
                    removeOnComplete: true,
                    attempts: EnJobRetry.FIVE
                }
            );
            return;
        } catch (err) {
            throw new HttpException(err.mesage, ResponseCode.BAD_REQUEST);
        }
    }

}
