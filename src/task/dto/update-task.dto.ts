import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaskStatus } from '../../database/entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'The new status to assign to the task.',
    enum: TaskStatus,
    example: TaskStatus['In-Progress'],
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      'newStatus must be one of the following values: To-Do, In-Progress, Completed',
  })
  newStatus?: TaskStatus;
}

export class AddTaskTagsDto {
  @ApiProperty({
    description: 'Array of tags to be added to the task.',
    type: [String],
    example: ['urgent', 'review'],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterTasksDto {
  @ApiProperty({
    description: 'Filter tasks by a specific tag.',
    example: 'urgent',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({
    description: 'Filter tasks by their status.',
    example: 'In-Progress',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({
    description: 'Page number for pagination.',
    example: 1,
    required: false,
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of tasks per page.',
    example: 10,
    required: false,
    type: Number,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Field to sort the tasks by.',
    example: 'dueDate',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Order to sort tasks, either ascending or descending.',
    enum: SortOrder,
    example: SortOrder.ASC,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}

export class AssignTaskDto {
  @ApiProperty({
    description: 'The email address of the user to be assigned to the task.',
    example: 'john.doe@example.com',
    type: String,
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
