import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
} from './dto/auth-credentials.dto';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/database/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Allows users to register by providing their authentication credentials.',
  })
  @ApiBody({
    description: 'Authentication credentials for user registration.',
    type: AuthCredentialsDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User registration successful.',
    type: User,
    schema: {
      example: {
        status: 'success',
        message: 'User registration successful',
        data: {
          id: 'user123',
          firstName: 'john',
          lastName: 'doe',
          email: 'john.doe@example.com',
          createdAt: '2024-08-25T12:00:00Z',
          updatedAt: '2024-08-25T12:00:00Z',
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
        message: 'Invalid registration data.',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict, user already exists.',
    schema: {
      example: {
        status: 'error',
        message: 'User already exists.',
      },
    },
  })
  async register(
    @Res() res: Response,
    @Body() authcredentialsDto: AuthCredentialsDto,
  ) {
    const savedUser = await this.authService.signUp(authcredentialsDto);
    return res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'User registration successful',
      data: savedUser,
    });
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Allows users to log in by providing their credentials.',
  })
  @ApiBody({
    description: 'Credentials required for user login.',
    type: LoginCredentialsDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User login successful.',
    type: User,
    schema: {
      example: {
        status: 'success',
        message: 'User login successful',
        data: {
          id: 'user123',
          firstName: 'john',
          lastName: 'doe',
          email: 'john.doe@example.com',
          token: 'jwt-token-example',
          createdAt: '2024-08-25T12:00:00Z',
          updatedAt: '2024-08-25T12:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials.',
    schema: {
      example: {
        status: 'error',
        message: 'Invalid username or password.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized access.',
    schema: {
      example: {
        status: 'error',
        message: 'Unauthorized access.',
      },
    },
  })
  async login(
    @Res() res: Response,
    @Body() loginCredentialsDto: LoginCredentialsDto,
  ) {
    const loginUser = await this.authService.signIn(loginCredentialsDto);
    return res.status(HttpStatus.OK).json({
      status: 'success',
      message: 'User login successful',
      data: loginUser,
    });
  }
}
