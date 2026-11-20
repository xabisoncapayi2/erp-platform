import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!user.tenantId || typeof user.tenantId !== 'string' || user.tenantId.trim() === '') {
      throw new ForbiddenException('Access denied: missing valid tenant context');
    }

    return true;
  }
}
