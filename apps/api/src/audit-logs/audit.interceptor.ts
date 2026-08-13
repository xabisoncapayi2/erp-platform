import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from './audit-logs.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, user, body } = req;

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (responseData) => {
          try {
            await this.auditLogsService.log({
              tenantId: user?.tenantId ?? 'system',
              userId: user?.sub ?? 'anonymous',
              action: `${method} ${url}`,
              entity: url.split('/')[1] || 'Unknown',
              entityId: responseData?.id || 'N/A',
              details: { body, response: responseData },
            });
          } catch (err) {
            // Non-blocking catch to ensure main request flow completes
          }
        }),
      );
    }
    return next.handle();
  }
}
