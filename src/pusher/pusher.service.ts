import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Pusher from 'pusher';

@Injectable()
export class PusherService {
  private pusher: Pusher;

  constructor(private readonly configService: ConfigService) {
    this.pusher = new Pusher({
      appId: configService.get('PUSHER_APP_ID'),
      key: configService.get('PUSHER_APP_KEY'),
      secret: configService.get('PUSHER_APP_SECRET'),
      cluster: configService.get('PUSHER_APP_CLUSTER'),
      useTLS: true,
    });
  }

  sendNotification(channel: string, event: string, message: any) {
    this.pusher.trigger(channel, event, message);
  }
}
