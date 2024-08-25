import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../database/entities/comment.entity';
import { Task } from 'src/database/entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Task, User]), AuthModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
