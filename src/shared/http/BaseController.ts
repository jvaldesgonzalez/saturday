import { NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
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
    this._logger.log('Executing...');
    return await this.executeImpl(req);
  }

  public conflict(message?: string): void {
    this._logger.warn('conflict', message);
    throw new ConflictException(message ? message : 'Conflict');
  }

  public clientError(message?: string): void {
    this._logger.warn('client_error', message);
    throw new BadRequestException(message ? message : 'Bad Request');
  }

  public unauthorized(message?: string): void {
    this._logger.warn('unauthorized', message);
    throw new UnauthorizedException(message ? message : 'Unauthorized');
  }

  public forbidden(message?: string): void {
    this._logger.warn('forbidden', message);
    throw new ForbiddenException(message ? message : 'Forbidden');
  }

  public notFound(message?: string): void {
    this._logger.warn('not_found', message);
    throw new NotFoundException(message ? message : 'NotFound');
  }

  public notImplemented(message?: string): void {
    this._logger.warn('not_implemented', message);
    throw new NotImplementedException(message ? message : 'Not Implemented');
  }

  public fail(error: Error | string): void {
    this._logger.error('Internal error', error.toString());
    throw new InternalServerErrorException(error);
  }
}
