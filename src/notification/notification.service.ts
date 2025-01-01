import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entities';
import { User } from 'src/database/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailJobData, RealTimeJobData } from './job-types';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('emailQueue') private readonly emailQueue: Queue<EmailJobData>,
    @InjectQueue('realTimeQueue')
    private readonly realTimeQueue: Queue<RealTimeJobData>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createNotification(user: User, subject: string, message: string) {
    const userEmail = user.email;

    // Add email notification job to the queue (for worker processing)
    await this.emailQueue.add('sendEmailNotification', {
      userEmail,
      subject,
      message,
    });

    // Add real-time notification job to the queue (for worker processing)
    await this.realTimeQueue.add('sendRealTimeNotification', {
      user,
      subject,
      message,
    });

    // Create the notification entity and save it to the database
    const notification = this.notificationRepository.create({ user, message });
    await this.notificationRepository.save(notification);

    return notification;
  }
}
