import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get('SMTP_HOST');
    const port = this.configService.get('SMTP_PORT');
    const user = this.configService.get('SMTP_USER');
    const pass = this.configService.get('SMTP_PASS');

    // Create a transporter using SMTP configuration
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: true,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(to: string, subject: string, message: string) {
    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to,
      subject,
      message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.verbose(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`);
      console.log(error);
    }
  }
}
