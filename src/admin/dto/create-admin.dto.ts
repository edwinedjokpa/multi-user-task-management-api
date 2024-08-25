import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { AdminRole } from '../../database/entities/admin.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The full name of the admin.',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description:
      'The email address of the admin. Must be a valid email address.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description:
      'The password for the admin account. Must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description:
      'The role of the admin. If not provided, a default role will be assigned.',
    enum: AdminRole,
    example: AdminRole.SUPER_ADMIN,
  })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}

export class AdminAuthCredentialsDto {
  @ApiProperty({
    description:
      'The email address of the admin. Must be a valid email address.',
    example: 'admin@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description:
      'The password for the admin account. Must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'Admin123!',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}

export class AdminDeleteCommentDto {
  @ApiProperty({
    description: 'The unique identifier of the comment to be deleted.',
    example: 'b3b0a3e0-5b2d-4f9d-a81c-6d3c7c2db238',
  })
  @IsNotEmpty()
  @IsString()
  commentId: string;
}
