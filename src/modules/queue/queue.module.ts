import { Module } from '@nestjs/common';
import { LoggerModule } from '../../utils/logger/logger.module';
import { MailingQueueProcessor } from './mailqueue.worker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from '../main/mail.entity';
import { MailModule } from '../../utils/mailer/mailer.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mail]),
        MailModule,
        LoggerModule
    ],
    exports: [MailingQueueProcessor],
    providers: [MailingQueueProcessor],
})
export class QueueModule { }

