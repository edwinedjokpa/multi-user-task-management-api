import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { RealTimeJobData } from './job-types';
import { Job } from 'bullmq';
import { PusherService } from 'src/pusher/pusher.service';

@Processor('realTimeQueue')
@Injectable()
export class RealTimeProcessor extends WorkerHost {
  private readonly logger: Logger = new Logger(RealTimeProcessor.name);
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly pusherService: PusherService,
  ) {
    super();
  }

  async process(job: Job<RealTimeJobData>) {
    const { user, subject, message } = job.data;
    this.notificationGateway.sendNotification(user.id, subject, message);
    this.pusherService.sendNotification(user.id, subject, {
      message,
    });
    this.logger.log(`Job: ${job.id} processed from queue`);
  }
}
