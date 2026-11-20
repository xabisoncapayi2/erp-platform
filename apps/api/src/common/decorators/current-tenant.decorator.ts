import { createParamDecorator, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!user.tenantId || typeof user.tenantId !== 'string' || user.tenantId.trim() === '') {
      throw new ForbiddenException('Tenant context missing from token');
    }

    return user.tenantId;
  },
);
