import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  AddTaskTagsDto,
  AssignTaskDto,
  FilterTasksDto,
  SortOrder,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../database/entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(user: User, createTaskDto: CreateTaskDto) {
    // Check if the user exists
    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    const task = await this.taskRepository.create({
      ...createTaskDto,
      creator: foundUser,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async findAll(filterDto: FilterTasksDto) {
    const {
      tag,
      status,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = SortOrder.ASC,
    } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');

    if (tag) {
      query.andWhere('task.tags @> :tag', { tag: `{${tag}}` });
    }

    if (status) {
      // Filter by status
      query.andWhere('task.status = :status', { status });
    }

    // Apply sorting if sortBy is provided, otherwise, apply default sorting
    if (sortBy) {
      query.orderBy(`task.${sortBy}`, sortOrder);
    } else {
      query.orderBy('task.dueDate', sortOrder);
    }

    // Apply pagination
    query.skip((page - 1) * limit).take(limit);

    // Fetch the tasks with the applied filters and pagination
    const tasks = await query.getMany();

    return tasks;
  }

  async findOne(taskId: string) {
    const taskExists = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['creator', 'comments', 'assignedTo'],
    });

    if (!taskExists) {
      throw new NotFoundException(`Task with id:#${taskId} not found`);
    }

    return taskExists;
  }

  async update(user: User, taskId: string, updateTaskDto: UpdateTaskDto) {
    const taskExists = await this.findOne(taskId);

    // Check if the user exists
    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    if (taskExists.creator.id !== foundUser.id) {
      throw new UnauthorizedException(
        'You cannot update a task you did not create',
      );
    }

    const updatedTask = await this.taskRepository.update(taskId, updateTaskDto);

    return updatedTask;
  }

  async updateStatus(
    user: User,
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const taskExists = await this.findOne(taskId);

    // Check if the user exists
    const foundUser = await this.userRepository.findOneBy({ id: user.id });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${user.id} not found`);
    }

    const permittedUsers =
      taskExists.assignedTo?.id === user.id ||
      taskExists.creator?.id === user.id;

    if (!permittedUsers) {
      throw new UnauthorizedException(
        'You cannot update the status of a task that was not created/assigned to you',
      );
    }

    taskExists.status = updateTaskStatusDto.newStatus;

    await this.taskRepository.save(taskExists);

    // Notify involved users
    if (taskExists.assignedTo) {
      await this.notificationService.createNotification(
        taskExists.assignedTo,
        `The status of task "${taskExists.title}" has been updated to "${updateTaskStatusDto.newStatus}"`,
      );
    }
    if (taskExists.creator) {
      await this.notificationService.createNotification(
        taskExists.creator,
        `The status of task "${taskExists.title}" has been updated to "${updateTaskStatusDto.newStatus}"`,
      );
    }

    return { newStatus: taskExists.status };
  }

  async remove(user: User, taskId: string) {
    const taskExists = await this.findOne(taskId);

    if (taskExists.creator.id !== user.id) {
      throw new UnauthorizedException(
        'You cannot delete a task you did not create',
      );
    }

    return this.taskRepository.delete({ id: taskId });
  }

  async addTags(taskId: string, addTaskTagsDto: AddTaskTagsDto) {
    const taskExists = await this.findOne(taskId);

    // Avoid adding duplicate tags
    const existingTags = new Set(taskExists.tags);
    addTaskTagsDto.tags.forEach((tag) => {
      if (!existingTags.has(tag)) {
        existingTags.add(tag);
      }
    });

    // Update task's tags
    taskExists.tags = Array.from(existingTags);

    // Save updated task
    await this.taskRepository.save(taskExists);

    return taskExists.tags;
  }

  async assignTask(taskId: string, assignTaskDto: AssignTaskDto) {
    const taskExists = await this.findOne(taskId);

    const assignUserToTask = await this.userRepository.findOneBy({
      email: assignTaskDto.email,
    });

    if (!assignUserToTask) {
      throw new NotFoundException(
        `User with email:${assignTaskDto.email} not found`,
      );
    }

    taskExists.assignedTo = assignUserToTask;
    await this.taskRepository.save(taskExists);

    await this.notificationService.createNotification(
      assignUserToTask,
      `You have been assigned to task "${taskExists.title}"`,
    );

    return taskExists;
  }
}
