import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { TaskStatus } from '../../database/entities/task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The title of the task',
    example: 'Complete project report',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the task',
    example:
      'Finish the final draft of the project report and submit it by end of the week.',
  })
  description: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The due date of the task',
    example: '2024-08-31T23:59:59Z',
  })
  dueDate: Date;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      'Status must be one of the following values: To-Do, In-Progress, Completed',
  })
  @ApiPropertyOptional({
    description: 'The status of the task',
    enum: TaskStatus,
    example: TaskStatus['To-Do'],
  })
  status?: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: 'Tags associated with the task',
    type: [String],
    example: ['urgent', 'important'],
  })
  tags?: string[];
}
