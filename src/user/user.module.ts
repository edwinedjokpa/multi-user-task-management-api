import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from 'src/database/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
