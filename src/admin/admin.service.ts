import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../database/entities/admin.entity';
import * as bcrypt from 'bcryptjs';
import {
  AdminAuthCredentialsDto,
  AdminDeleteCommentDto,
  CreateAdminDto,
} from './dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload';
import { Task } from 'src/database/entities/task.entity';
import {
  FilterTasksDto,
  SortOrder,
  UpdateTaskStatusDto,
} from 'src/task/dto/update-task.dto';
import { Comment } from 'src/database/entities/comment.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(createAdminDto: CreateAdminDto) {
    const adminExists = await this.adminRepository.findOneBy({
      email: createAdminDto.email,
    });

    if (adminExists) {
      throw new ConflictException('Admin with email address already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const newAdmin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return await this.adminRepository.save(newAdmin);
  }

  async login(adminAuthCredentialsDto: AdminAuthCredentialsDto) {
    const { email, password } = adminAuthCredentialsDto;

    // Check if a user with the provided email exists
    const adminExists = await this.adminRepository.findOneBy({ email });

    // If user doesn't exist or password doesn't match, throw an error
    if (
      !adminExists ||
      !(await bcrypt.compare(password, adminExists.password))
    ) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: adminExists.email,
      userId: adminExists.id,
      type: 'admin',
    };

    // Generate JWT token
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async create(admin: Admin, createAdminDto: CreateAdminDto) {
    const loginAdmin = await this.adminRepository.findOneBy({ id: admin.id });

    const isPermitted = loginAdmin.role === 'Super-Admin';

    if (!loginAdmin || !isPermitted) {
      throw new UnauthorizedException('You cannot create an admin');
    }

    const adminExists = await this.adminRepository.findOneBy({
      email: createAdminDto.email,
    });

    if (adminExists) {
      throw new ConflictException('Admin with email address already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);
    const newAdmin = this.adminRepository.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    return await this.adminRepository.save(newAdmin);
  }

  async getTasks(filterDto: FilterTasksDto) {
    const {
      tag,
      status,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder = SortOrder.ASC,
    } = filterDto;

    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .leftJoinAndSelect('task.creator', 'creator')
      .leftJoinAndSelect('task.comments', 'comments');

    if (tag) {
      // Filter by tag
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

  async getTaskById(taskId: string) {
    const taskExists = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['assignedTo', 'creator'],
    });

    if (!taskExists) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return taskExists;
  }

  async updateTaskStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = await this.getTaskById(taskId);

    task.status = updateTaskStatusDto.newStatus;

    // Notify involved users
    if (task.assignedTo) {
      await this.notificationService.createNotification(
        task.assignedTo,
        `The status of task "${task.title}" has been updated to "${updateTaskStatusDto.newStatus}"`,
      );
    }
    if (task.creator) {
      await this.notificationService.createNotification(
        task.creator,
        `The status of task "${task.title}" has been updated to "${updateTaskStatusDto.newStatus}"`,
      );
    }

    return await this.taskRepository.save(task);
  }

  async deleteTaskById(taskId: string) {
    await this.getTaskById(taskId);

    return this.taskRepository.delete({ id: taskId });
  }

  async getTaskComments(taskId: string) {
    const taskExists = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['comments'],
    });

    if (!taskExists) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const comments = taskExists.comments;

    return comments;
  }

  async deleteTaskComment(
    taskId: string,
    adminDeleteCommentDto: AdminDeleteCommentDto,
  ) {
    const { commentId } = adminDeleteCommentDto;
    await this.getTaskById(taskId);

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'task'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found.`);
    }

    // Ensure the task and its comments are valid
    const task = comment.task;

    if (task) {
      if (!task.comments) {
        task.comments = [];
      }
      // Remove the comment from the task's comments list
      task.comments = task.comments.filter((c) => c.id !== comment.id);

      // Save the updated task
      await this.taskRepository.save(task);
    }

    // Remove the comment
    await this.commentRepository.remove(comment);
  }
}
