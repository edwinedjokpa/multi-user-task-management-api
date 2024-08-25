import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../database/entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/database/entities/user.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    AuthModule,
    NotificationModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
