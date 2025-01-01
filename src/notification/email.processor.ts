import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { Job } from 'bullmq';
import { EmailJobData } from './job-types';

@Processor('emailQueue')
@Injectable()
export class EmailProcessor extends WorkerHost {
  private readonly logger: Logger = new Logger(EmailProcessor.name);
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJobData>) {
    const { userEmail, subject, message } = job.data;
    await this.emailService.sendEmail(userEmail, subject, message);
    this.logger.log(`Job: ${job.id} processed from queue`);
  }
}
