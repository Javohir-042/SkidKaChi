import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/model/user.model';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendMail(user: User) {
        const url = `${process.env.PORT}/api/users/activate/${user.activation_link}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: "Welcome to Skidkachi App!",
            template: "./confirmation",
            context: {
                name: user.name,
                url,
                year: new Date().getFullYear()
            },
        });
    }
}
    