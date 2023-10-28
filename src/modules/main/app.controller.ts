import { Body, Controller, Post, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { LoggerService } from "../../utils/logger/logger.service";
import { MailDto } from "./common/mail.dtos";
import { Response } from 'express';
import { ResponseCode } from "utils/enums";

@Controller("/mailer")
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly loggerService: LoggerService
    ) { }

    @Post('send_mail')
    async sendMail(
        @Body() body: MailDto,
        @Res() res: Response
    ) {
        this.loggerService.log(`POST /mailer/send_mail api has been called`);
        await this.appService.sendMail(body.email, body.name);
        return res.status(ResponseCode.SUCCESS).send();
    }
}
