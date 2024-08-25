import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'The first name of the user. Should not be empty.',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'First name should not be empty' })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user. Should not be empty.',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: 'Last name should not be empty' })
  lastName: string;

  @ApiProperty({
    description:
      'The email address of the user. Must be a valid email address.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description:
      'The password for the user account. Must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
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
}

export class LoginCredentialsDto {
  @ApiProperty({
    description:
      'The email address of the user. Must be a valid email address.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description:
      'The password for the user account. Must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
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
}
