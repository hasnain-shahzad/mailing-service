import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/main/app.module';
import { LoggerMock, MailerMock, MailingQueueMock } from '../mock/provider.mocks';
import { LoggerService } from '../../src/utils/logger/logger.service';
import request from 'supertest';
import { ResponseCode, ResponseMessage } from '../../src/utils/enums';
import { getQueueToken } from '@nestjs/bull';
import { EnQueueName } from '../../src/modules/queue/common/queue.enums';
import { MailingQueueProcessor } from '../../src/modules/queue/mailqueue.worker';
import { MailService } from '../../src/utils/mailer/mailer.service';
import { Mail } from '../../src/modules/main/mail.entity';
import { EnMailStatus } from '../../src/modules/main/common/mail.enums';
import { Helper } from '../test.helper';

describe('Mailing App Test Cases', () => {
    let app: INestApplication;
    let server: any;
    let testMailReq = {
        name: 'testuser',
        email: 'testuser555@yopmail.com'
    }
    let mailingQueueProcessor: MailingQueueProcessor;
    let helper = new Helper();

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(LoggerService)
            .useValue(LoggerMock)
            .overrideProvider(MailService)
            .useValue(MailerMock)
            .overrideProvider(getQueueToken(EnQueueName.MAILING))
            .useValue(MailingQueueMock)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        mailingQueueProcessor = app.get(MailingQueueProcessor);
        server = app.getHttpServer();
    });

    it(`Should send email upon successful data validation in body`, async () => {
        await request(server)
            .post(`/mailer/send_mail`)
            .send({
                name: testMailReq.name,
                email: testMailReq.email
            })
            .expect(ResponseCode.SUCCESS)
    });

    it(`Should process send email request as a job in mailing queue processor`, async () => {
        const mail = new Mail().fromDto(testMailReq.name, testMailReq.email);
        const jobData: any = {
            data: {
                mail
            }
        };
        await mailingQueueProcessor.sendEmail(jobData).then((data) => {
            expect(data).toEqual(ResponseMessage.SUCCESS);
        })
    });

    it(`Should get email list and it should be of length 1 `, async () => {
        await request(server)
            .get(`/mailer/mail_requests`)
            .expect(ResponseCode.SUCCESS)
            .expect(({ body }) => {
                expect(body.data).toBeDefined();
                expect(body.data.length).toEqual(1);
                expect(body.data[0].name).toEqual(testMailReq.name);
                expect(body.data[0].email).toEqual(testMailReq.email);
                expect(body.data[0].status).toEqual(EnMailStatus.SENT);
            });
    });

    afterAll(async () => {
        await helper.clearDB();
        await app.close();
    })
});
