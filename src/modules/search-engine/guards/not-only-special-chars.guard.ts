import { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { getDefaultPaginatedFindResult } from 'src/shared/core/PaginatedFindResult';

@Injectable()
export class NotOnlySpecialCharsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const q: string = req.query.q.toString();
    if (!q) return next();
    if (q.length <= 2) return res.json(getDefaultPaginatedFindResult());
    return next();
  }
}
