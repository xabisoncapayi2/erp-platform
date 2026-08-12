import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, user, headers } = req;

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const tenantId = headers['x-tenant-id'] || user?.tenantId;
      const userId = user?.id || user?.sub || 'system';
      const entity = url.split('/')[1]?.split('?')[0] || 'unknown';

      return next.handle().pipe(
        tap(async (responseData) => {
          if (tenantId) {
            await this.prisma.auditLog.create({
              data: {
                tenantId,
                userId,
                action: `${method} ${url}`,
                entity,
                payload: {
                  requestBody: body,
                  responseSummary: responseData?.id ? { id: responseData.id } : 'success',
                },
              },
            });
          }
        }),
      );
    }

    return next.handle();
  }
}
