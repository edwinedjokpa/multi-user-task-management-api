import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entities';
import { User } from 'src/database/entities/user.entity';
import { NotificationGateway } from './notification.gateway';
import { PusherService } from 'src/pusher/pusher.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
    private readonly pusherService: PusherService,
    private readonly emailService: EmailService,
  ) {}

  async createNotification(user: User, message: string) {
    const notification = this.notificationRepository.create({ user, message });
    await this.notificationRepository.save(notification);

    //send real-time notification via WebSocket
    this.notificationGateway.sendNotification(user.id, message);

    // Send real-time notification using Pusher
    // this.pusherService.sendNotification(user.id, 'notification', { message });

    // Send email notification
    // await this.emailService.sendEmail(
    //   user.email,
    //   'New Email Notification',
    //   message,
    // );

    return notification;
  }
}
