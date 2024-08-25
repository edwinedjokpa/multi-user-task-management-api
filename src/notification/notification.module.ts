import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../database/entities/notification.entities';
import { NotificationGateway } from './notification.gateway';
import { PusherService } from 'src/pusher/pusher.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [],
  providers: [
    NotificationService,
    NotificationGateway,
    PusherService,
    EmailService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
