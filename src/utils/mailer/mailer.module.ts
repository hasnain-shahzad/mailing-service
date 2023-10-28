import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { MailService } from "./mailer.service";

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () => {
                try {
                    return MailService.configureNodeMailer();
                } catch (err) {
                    console.error('NodeMailer connection error');
                }
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule { }
