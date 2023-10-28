import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    /**
     * Send email to given mail
     * @param contact
     */
    public async sendEmail(name: string, email: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                await this.mailerService.sendMail({
                    to: email,
                    subject: "Confirmation Email",
                    html: `
                      <div>Hi  ${name}</div><br>
                      <div>Your account has been created successfully.</div><br>
                    `,
                });
                resolve();
            } catch (err) {
                reject();
            }
        });
    }

    /**
     * Configure Mailer Agent for NodeMailer Module
     * @returns 
     */
    static configureNodeMailer() {
        return {
            transport: {
                service: process.env.EMAIL_SMTP_SERVICE,
                host: process.env.EMAIL_SMTP_HOST,
                port: Number(process.env.EMAIL_SMTP_PORT),
                ignoreTLS: false,
                secure: false,
                auth: {
                    user: process.env.EMAIL_SMTP_USER,
                    pass: process.env.EMAIL_SMTP_PASS,
                },
            },
            defaults: {
                from: process.env.EMAIL_SMTP_USER,
            }
        };
    }
}
