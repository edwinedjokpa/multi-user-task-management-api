import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt.payload';
import { User } from 'src/database/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Admin } from 'src/database/entities/admin.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User | Admin> {
    const { userId, type } = payload;

    let user: User | Admin | null = null;

    if (type === 'user') {
      user = await this.userRepository.findOneBy({ id: userId });
    } else if (type === 'admin') {
      user = await this.adminRepository.findOneBy({ id: userId });
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized!');
    }

    return { ...user, role: payload.type };
  }
}
