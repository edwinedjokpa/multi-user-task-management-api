import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import {
  AddTaskTagsDto,
  AssignTaskDto,
  FilterTasksDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
} from './dto/update-task.dto';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Task, TaskStatus } from '../database/entities/task.entity';

@ApiTags('tasks')
@Controller('tasks')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'This endpoint allows you to create a new task. Provide task details in the request body.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully.',
    type: Task,
    schema: {
      example: {
        status: 'success',
        message: 'Task created successfully',
        data: {
          id: 'abc123',
          title: 'Complete project report',
          description:
            'Finish the final draft of the project report and submit it by end of the week.',
          dueDate: '2024-08-31T23:59:59Z',
          status: 'To-Do',
          tags: ['urgent', 'important'],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input.',
    schema: {
      example: {
        status: 'error',
        message: 'Validation failed',
        errors: {
          title: 'Title is required',
          description: 'Description is required',
        },
      },
    },
  })
  async create(@GetUser() user: User, @Body() createTaskDto: CreateTaskDto) {
    const createdTask = await this.taskService.create(user, createTaskDto);

    return {
      status: 'success',
      message: 'Task created successfully',
      data: createdTask,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of tasks',
    description:
      'Get all tasks based on filter criteria. Query parameters can be used to filter tasks.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter tasks by status',
    enum: TaskStatus,
    type: String,
    example: 'To-Do',
  })
  @ApiQuery({
    name: 'dueDate',
    required: false,
    description: 'Filter tasks by due date (ISO 8601 format)',
    type: String,
    example: '2024-08-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully.',
    type: [Task],
    schema: {
      example: {
        status: 'success',
        message: 'Tasks retrieved successfully',
        data: [
          {
            id: 'abc123',
            title: 'Complete project report',
            description:
              'Finish the final draft of the project report and submit it by end of the week.',
            dueDate: '2024-08-31T23:59:59Z',
            status: 'To-Do',
            tags: ['urgent', 'important'],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid query parameters provided.',
      },
    },
  })
  async findAll(@Query() filterDto: FilterTasksDto) {
    const tasks = await this.taskService.findAll(filterDto);

    return {
      status: 'success',
      message: 'Tasks retrieved successfully',
      data: tasks,
    };
  }

  @Get(':taskId')
  @ApiOperation({
    summary: 'Retrieve a specific task by ID',
    description: 'Fetch details of a task using its unique ID.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description: 'The unique identifier of the task to retrieve.',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Task data retrieved successfully.',
    type: Task,
    schema: {
      example: {
        status: 'success',
        message: 'Task data retrieved successfully',
        data: {
          id: 'abc123',
          title: 'Complete project report',
          description:
            'Finish the final draft of the project report and submit it by end of the week.',
          dueDate: '2024-08-31T23:59:59Z',
          status: 'To-Do',
          tags: ['urgent', 'important'],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Task with the given ID not found.',
      },
    },
  })
  async findOne(@Param('taskId') taskId: string) {
    const task = await this.taskService.findOne(taskId);

    return {
      status: 'success',
      message: 'Task data retrieved successfully',
      data: task,
    };
  }

  @Put(':taskId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a specific task by ID',
    description:
      'Update details of a task using its unique ID. Only the owner or the assigned user can update the task.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description: 'The unique identifier of the task to update.',
    example: 'abc123',
  })
  @ApiBody({
    description: 'The task data to update.',
    type: UpdateTaskDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Task data updated successfully.',
    type: Task,
    schema: {
      example: {
        status: 'success',
        message: 'Tasks data updated successfully',
        data: {
          id: 'abc123',
          title: 'Complete project report',
          description:
            'Finish the final draft of the project report and submit it by end of the week.',
          dueDate: '2024-08-31T23:59:59Z',
          status: 'In-Progress',
          tags: ['urgent', 'important'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid input data provided.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. User does not have permission to update the task.',
    schema: {
      example: {
        status: 'error',
        message: 'You do not have permission to update this task.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Task with the given ID not found.',
      },
    },
  })
  async update(
    @GetUser() user: User,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const updatedTask = await this.taskService.update(
      user,
      taskId,
      updateTaskDto,
    );

    return {
      status: 'success',
      message: 'Task data updated successfully',
      data: updatedTask,
    };
  }

  @Put(':taskId/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update the status of a specific task by ID',
    description:
      'Update the status of a task using its unique ID. Only the task owner or assigned user can update the status.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description:
      'The unique identifier of the task whose status needs to be updated.',
    example: 'abc123',
  })
  @ApiBody({
    description: 'The new status to update for the task.',
    type: UpdateTaskStatusDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Task status successfully updated',
        data: {
          id: 'abc123',
          title: 'Complete project report',
          description:
            'Finish the final draft of the project report and submit it by end of the week.',
          dueDate: '2024-08-31T23:59:59Z',
          status: 'In-Progress',
          tags: ['urgent', 'important'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid status value provided.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. User does not have permission to update the status.',
    schema: {
      example: {
        status: 'error',
        message: 'You do not have permission to update this task status.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Task with the given ID not found.',
      },
    },
  })
  async updateStatus(
    @GetUser() user: User,
    @Param('taskId') taskId: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    const updatedStatus = await this.taskService.updateStatus(
      user,
      taskId,
      updateTaskStatusDto,
    );

    return {
      status: 'success',
      message: 'Task status successfully updated',
      data: updatedStatus,
    };
  }

  @Put(':taskId/tags')
  @ApiOperation({
    summary: 'Add tags to a specific task by ID',
    description:
      'Add or update tags for a task using its unique ID. This operation allows you to modify the tags associated with the task.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description:
      'The unique identifier of the task to which tags will be added.',
    example: 'abc123',
  })
  @ApiBody({
    description: 'The tags to add to the task.',
    type: AddTaskTagsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Tags added successfully.',
    type: Task,
    schema: {
      example: {
        status: 'success',
        message: 'Tags added successfully',
        data: {
          id: 'abc123',
          title: 'Complete project report',
          description:
            'Finish the final draft of the project report and submit it by end of the week.',
          dueDate: '2024-08-31T23:59:59Z',
          status: 'In-Progress',
          tags: ['urgent', 'important', 'new-tag'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid tags provided.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Task with the given ID not found.',
      },
    },
  })
  async addTags(
    @Param('taskId') taskId: string,
    @Body() addTaskTagsDto: AddTaskTagsDto,
  ) {
    const addedTags = await this.taskService.addTags(taskId, addTaskTagsDto);

    return {
      status: 'success',
      message: 'Tags added successfully',
      data: addedTags,
    };
  }

  @Put(':taskId/assign')
  @ApiOperation({
    summary: 'Assign a user to a specific task by ID',
    description:
      'Assign a user to a task using its unique ID. This operation updates the task with the new assignee.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description: 'The unique identifier of the task to assign.',
    example: 'abc123',
  })
  @ApiBody({
    description: 'The user details to assign to the task.',
    type: AssignTaskDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Task assigned successfully.',
    type: Task,
    schema: {
      example: {
        status: 'success',
        message: 'Task assigned successfully',
        data: {
          id: 'abc123',
          title: 'Complete project report',
          description:
            'Finish the final draft of the project report and submit it by end of the week.',
          dueDate: '2024-08-31T23:59:59Z',
          status: 'Assigned',
          assignedTo: {
            id: 'user123',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          tags: ['urgent', 'important'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid user ID provided.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Task with the given ID not found.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: {
        status: 'error',
        message: 'User with the given ID not found.',
      },
    },
  })
  async assignTask(
    @Param('taskId') taskId: string,
    @Body() assignTaskDto: AssignTaskDto,
  ) {
    const task = await this.taskService.assignTask(taskId, assignTaskDto);

    return {
      status: 'success',
      message: 'Task assigned successfully',
      data: task,
    };
  }

  @Delete(':taskId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a specific task by ID',
    description:
      'Delete a task using its unique ID. Only the owner or assigned user can delete the task.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description: 'The unique identifier of the task to be deleted.',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Task deleted successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Task deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid task ID provided.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized. User does not have permission to delete the task.',
    schema: {
      example: {
        status: 'error',
        message: 'You do not have permission to delete this task.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Task with the given ID not found.',
      },
    },
  })
  async remove(@GetUser() user: User, @Param('taskId') taskId: string) {
    await this.taskService.remove(user, taskId);

    return {
      status: 'success',
      message: 'Task deleted successfully',
    };
  }
}
