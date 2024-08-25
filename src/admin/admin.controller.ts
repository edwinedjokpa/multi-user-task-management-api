import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AdminAuthCredentialsDto,
  AdminDeleteCommentDto,
  CreateAdminDto,
} from './dto/create-admin.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  FilterTasksDto,
  UpdateTaskStatusDto,
} from 'src/task/dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task } from 'src/database/entities/task.entity';
import { Comment } from 'src/database/entities/comment.entity';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { Admin } from 'src/database/entities/admin.entity';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @ApiOperation({ summary: 'Admin registration' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin registration successfully.',
    type: CreateAdminDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async register(@Body() createAdminDto: CreateAdminDto) {
    const createdAdmin = await this.adminService.register(createAdminDto);

    return {
      status: 'success',
      message: 'Admin registration successful',
      data: createdAdmin,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin login successful.',
    type: AdminAuthCredentialsDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid login credentials.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async login(@Body() adminAuthCredentialsDto: AdminAuthCredentialsDto) {
    const loginAdmin = await this.adminService.login(adminAuthCredentialsDto);

    return {
      status: 'success',
      message: 'Admin login successful',
      data: loginAdmin,
    };
  }

  @Post('create')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New admin created successfully.',
    type: CreateAdminDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async create(
    @GetUser() admin: Admin,
    @Body() createAdminDto: CreateAdminDto,
  ) {
    const createdAdmin = await this.adminService.create(admin, createAdminDto);

    return {
      status: 'success',
      message: 'New admin created',
      data: createdAdmin,
    };
  }

  @Get('tasks')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Retrieve tasks with optional filters' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks retrieved successfully.',
    type: [Task],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid query parameters.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async getTasks(@Query() filterTaskDto: FilterTasksDto) {
    const tasks = await this.adminService.getTasks(filterTaskDto);

    return {
      status: 'success',
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  @Get('tasks/:taskId')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Retrieve a single task by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task data retrieved successfully.',
    type: Task,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async getTask(@Param('taskId') taskId: string) {
    const task = await this.adminService.getTaskById(taskId);

    return {
      status: 'success',
      message: 'Task data retrieved successfully',
      data: task,
    };
  }

  @Put('tasks/:taskId/status')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update the status of a task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task status updated successfully.',
    type: Task,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updatedTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const task = await this.adminService.updateTaskStatus(
      taskId,
      updatedTaskStatusDto,
    );

    return {
      status: 'success',
      message: 'Task status updated successfully',
      data: task,
    };
  }

  @Get('tasks/:taskId/comments')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Retrieve all comments for a specific task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Comments retrieved successfully.',
    type: [Comment],
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  async getTaskComment(@Param('taskId') taskId: string) {
    const comments = await this.adminService.getTaskComments(taskId);

    return {
      status: 'success',
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }

  @Delete('tasks/:taskId/comments')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a comment from a specific task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Comment deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task or comment not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data.',
  })
  async deleteTaskComment(
    @Param('taskId') taskId: string,
    @Body() body: AdminDeleteCommentDto,
  ) {
    await this.adminService.deleteTaskComment(taskId, body);

    return { status: 'success', message: 'Comment deleted successfully' };
  }

  @Delete('tasks:/taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a specific task by ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task deleted successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found.' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data.',
  })
  async deleteTask(@Param('taskId') taskId: string) {
    await this.adminService.deleteTaskById(taskId);

    return {
      status: 'success',
      message: 'Task deleted successfully',
    };
  }
}
