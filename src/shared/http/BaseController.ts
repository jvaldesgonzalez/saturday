import { NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

export abstract class BaseController<IRequest, IResponse> {
  protected readonly _logger: Logger;
  constructor(context = 'BaseController') {
    this._logger = new Logger(context);
  }

  protected abstract executeImpl(req: IRequest): Promise<IResponse>;

  public async execute(req: IRequest): Promise<IResponse> {
    return await this.executeImpl(req);
  }

  public clientError(message?: string): void {
    throw new BadRequestException(message ? message : 'Bad Request');
  }

  public unauthorized(message?: string): void {
    throw new UnauthorizedException(message ? message : 'Unauthorized');
  }

  public forbidden(message?: string): void {
    throw new ForbiddenException(message ? message : 'Forbidden');
  }

  public notFound(message?: string): void {
    throw new NotFoundException(message ? message : 'NotFound');
  }

  public notImplemented(message?: string): void {
    throw new NotImplementedException(message ? message : 'Not Implemented');
  }

  public fail(error: Error | string): void {
    throw new InternalServerErrorException(error);
  }
}
