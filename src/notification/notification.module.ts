import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../database/entities/notification.entities';
import { NotificationGateway } from './notification.gateway';
import { PusherService } from 'src/pusher/pusher.service';
import { EmailService } from 'src/email/email.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';
import { RealTimeProcessor } from './real-time.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.registerQueue({ name: 'emailQueue' }),
    BullModule.registerQueue({ name: 'realTimeQueue' }),
  ],
  controllers: [],
  providers: [
    NotificationService,
    NotificationGateway,
    PusherService,
    EmailService,
    EmailProcessor,
    RealTimeProcessor,
  ],
  exports: [NotificationService, BullModule],
})
export class NotificationModule {}
