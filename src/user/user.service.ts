import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/database/entities/task.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async getTasks(user: User) {
    // Check if the user exists
    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    const userTasks = await this.taskRepository.find({
      where: { assignedTo: { id: foundUser.id } },
    });

    return userTasks;
  }
}
