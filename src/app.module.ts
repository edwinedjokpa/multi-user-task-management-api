import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { CommentModule } from './comment/comment.module';
import { AdminModule } from './admin/admin.module';
import { NotificationModule } from './notification/notification.module';
import { PusherService } from './pusher/pusher.service';
import { EmailService } from './email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeorm from './database/ormconfig';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    AuthModule,
    // DatabaseModule,
    UserModule,
    TaskModule,
    CommentModule,
    AdminModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PusherService, EmailService],
})
export class AppModule {}
