import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  AuthCredentialsDto,
  LoginCredentialsDto,
} from './dto/auth-credentials.dto';
import { JwtPayload } from './interfaces/jwt.payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    const userExists = await this.userRepository.findOneBy({
      email: authCredentialsDto.email,
    });

    if (userExists) {
      throw new ConflictException('User with email already exists');
    }

    const hashedPassword = await bcrypt.hash(authCredentialsDto.password, 10);

    const user = this.userRepository.create({
      ...authCredentialsDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }

  async signIn(loginCredentialsDto: LoginCredentialsDto) {
    const { email, password } = loginCredentialsDto;

    // Check if a user with the provided email exists
    const userExists = await this.userRepository.findOneBy({ email });

    // If user doesn't exist or password doesn't match, throw an error
    if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: JwtPayload = {
      email: userExists.email,
      userId: userExists.id,
      type: 'user',
    };

    // Generate JWT token
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
