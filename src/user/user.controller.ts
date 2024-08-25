import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../database/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Task } from 'src/database/entities/task.entity';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('tasks')
  @ApiOperation({
    summary: 'Retrieve tasks assigned to the authenticated user',
    description:
      'Fetch all tasks that are assigned to the currently authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks successfully retrieved.',
    type: [Task],
    schema: {
      example: {
        status: 'success',
        message: 'User tasks retrieved',
        data: [
          {
            id: 'abc123',
            title: 'Complete the report',
            description: 'Finish the report by end of the week',
            dueDate: '2024-08-31T23:59:59Z',
            status: 'In-Progress',
            tags: ['urgent', 'important'],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: {
        status: 'error',
        message: 'You must be logged in to access this resource.',
      },
    },
  })
  async getUserTasks(@GetUser() user: User) {
    const userTasks = await this.userService.getTasks(user);

    return {
      status: 'success',
      message: 'User tasks retrieved',
      data: userTasks,
    };
  }
}
