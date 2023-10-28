import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggerService } from '../../utils/logger/logger.service';
import { EnJob, EnQueueName } from './common/queue.enums';
import { MailService } from '../../utils/mailer/mailer.service';
import { Mail } from '../main/mail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnMailStatus } from '../main/common/mail.enums';
import { ResponseMessage } from '../../utils/enums';

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
    public sendEmail(job: Job) {
        return new Promise<string>(async (resolve, reject) => {
            try {
                this.loggerService.log(
                    `Send email job started for id : ${job.data.mail.email}`
                );
                const newMailRequest = await this.mailRepository.save(job.data.mail);
                await this.mailerService.sendEmail(newMailRequest.name, newMailRequest.email);
                newMailRequest.status = EnMailStatus.SENT;
                await this.mailRepository.save(newMailRequest);
                this.loggerService.log(
                    `Send email job ended for id : ${job.data.mailId}`
                );
                resolve(ResponseMessage.SUCCESS);
            } catch (err) {
                this.loggerService.error(err);
                reject(err);
            }
        });
    }
}