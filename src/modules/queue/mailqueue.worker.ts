import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggerService } from '../../utils/logger/logger.service';
import { EnJob, EnQueueName } from './common/queue.enums';
import { MailService } from '../../utils/mailer/mailer.service';
import { Mail } from '../main/mail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnMailStatus } from 'modules/main/common/mail.enums';

@Processor(EnQueueName.MAILING)
export class MailingQueueProcessor {
    constructor(
        @InjectRepository(Mail)
        private readonly mailRepository: Repository<Mail>,
        private readonly loggerService: LoggerService,
        private readonly mailerService: MailService
    ) {
        this.loggerService.setContext('MailingQueueProcessor');
    }

    /**
     * Send email job processor of mailing queue
     *
     * @param job
     * @returns
     */
    @Process(EnJob.SEND_EMAIL)
    public startSurvey(job: Job) {
        return new Promise<void>(async (resolve, reject) => {
            try {
                this.loggerService.log(
                    `Send email job started for id : ${job.data.mailId}`
                );
                const mail = await this.mailRepository.findOne(job.data.mailId);
                await this.mailerService.sendEmail(mail.name, mail.email);
                mail.status = EnMailStatus.SENT;
                await this.mailRepository.save(mail);
                this.loggerService.log(
                    `Send email job ended for id : ${job.data.mailId}`
                );
                resolve();
            } catch (err) {
                this.loggerService.error(err);
                reject(err);
            }
        });
    }
}