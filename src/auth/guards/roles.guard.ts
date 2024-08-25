import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Define an interface for User to ensure type safety
interface User {
  type: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the roles metadata set on the handler
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // If no roles are required, access is granted
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // If user is not present, deny access
    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    // Check if the user has at least one of the required roles
    return requiredRoles.includes(user.type);
  }
}
