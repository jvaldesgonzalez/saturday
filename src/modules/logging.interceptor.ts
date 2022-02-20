import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log({ body: request.body, url: request.url });

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => console.log({ data })),
      catchError((err) => {
        console.log({ error: err.response });
        return throwError(() => err);
      }),
    );
  }
}
