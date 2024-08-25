import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from '../database/entities/comment.entity';

@ApiTags('comments')
@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new comment for a task',
    description:
      'Allows authenticated users to create a new comment on a specific task.',
  })
  @ApiParam({
    name: 'taskId',
    type: String,
    description:
      'The unique identifier of the task to which the comment will be added.',
    example: 'abc123',
  })
  @ApiBody({
    description: 'Details of the comment to be created.',
    type: CreateCommentDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
    type: Comment,
    schema: {
      example: {
        status: 'success',
        message: 'Comment created successfully',
        data: {
          id: 'comment123',
          taskId: 'abc123',
          userId: 'user123',
          content: 'This is a comment.',
          createdAt: '2024-08-25T12:00:00Z',
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
        message: 'Invalid comment data.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: {
        status: 'error',
        message: 'You must be logged in to add a comment.',
      },
    },
  })
  async create(
    @GetUser() user: User,
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const comment = await this.commentService.createComment(
      user,
      taskId,
      createCommentDto,
    );

    return {
      status: 'success',
      message: 'Comment created successfully',
      data: comment,
    };
  }

  @Put(':commentId')
  @ApiOperation({
    summary: 'Update an existing comment',
    description:
      'Allows authenticated users to update a specific comment by its ID.',
  })
  @ApiParam({
    name: 'commentId',
    type: String,
    description: 'The unique identifier of the comment to be updated.',
    example: 'comment123',
  })
  @ApiBody({
    description: 'Details of the comment to be updated.',
    type: UpdateCommentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully.',
    type: Comment,
    schema: {
      example: {
        status: 'success',
        message: 'Comment updated successfully',
        data: {
          id: 'comment123',
          taskId: 'abc123',
          userId: 'user123',
          content: 'This is the updated comment.',
          createdAt: '2024-08-25T12:00:00Z',
          updatedAt: '2024-08-26T12:00:00Z',
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
        message: 'Invalid comment data.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: {
        status: 'error',
        message: 'You must be logged in to update this comment.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Comment with the given ID not found.',
      },
    },
  })
  async update(
    @GetUser() user: User,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentService.updateComment(
      user,
      commentId,
      updateCommentDto,
    );

    return {
      status: 'success',
      message: 'Comment updated successfully',
      data: comment,
    };
  }

  @Delete(':commentId')
  @ApiOperation({
    summary: 'Delete a comment',
    description:
      'Allows authenticated users to delete a specific comment by its ID.',
  })
  @ApiParam({
    name: 'commentId',
    type: String,
    description: 'The unique identifier of the comment to be deleted.',
    example: 'comment123',
  })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully.',
    schema: {
      example: {
        status: 'success',
        message: 'Comment deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: {
        status: 'error',
        message: 'You must be logged in to delete this comment.',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found.',
    schema: {
      example: {
        status: 'error',
        message: 'Comment with the given ID not found.',
      },
    },
  })
  async delete(@GetUser() user: User, @Param('commentId') commentId: string) {
    await this.commentService.deleteComment(user, commentId);

    return {
      status: 'success',
      message: 'Comment deleted successfully',
    };
  }
}
