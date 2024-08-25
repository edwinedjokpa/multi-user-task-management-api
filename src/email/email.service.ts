import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailgun from 'mailgun-js';

@Injectable()
export class EmailService {
  //   private mg: mailgun.Mailgun;
  //   constructor(private readonly configService: ConfigService) {
  //     const apiKey = this.configService.get('MAILGUN_API_KEY');
  //     const domain = this.configService.get('MAILGUN_DOMAIN');
  //     this.mg = mailgun({ apiKey, domain });
  //   }
  //   async sendEmail(to: string, subject: string, text: string) {
  //     const data = {
  //       from: this.configService.get('MAILGUN_FROM'),
  //       to,
  //       subject,
  //       text,
  //     };
  //     try {
  //       await this.mg.messages().send(data);
  //       console.log(`Email sent to ${to}`);
  //     } catch (error) {
  //       console.error(`Failed to send email to ${to}:`, error);
  //     }
  //   }
}
