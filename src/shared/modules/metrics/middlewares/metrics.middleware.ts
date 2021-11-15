import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { NextFunction, Request, Response } from 'express';
import { Histogram } from 'prom-client';

@Injectable()
export class HttpReqPerSecMiddleware implements NestMiddleware {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private histogram: Histogram<string>,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    const end = this.histogram.startTimer();

    next();
    res.on('finish', () => {
      if (req.method && req.path && res.statusCode)
        end({
          method: req.method,
          route: req.path,
          code: res.statusCode,
        });
    });
  }
}
