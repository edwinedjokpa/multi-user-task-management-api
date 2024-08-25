import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../database/entities/admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/database/entities/task.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Task, Comment]),
    AuthModule,
    NotificationModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
