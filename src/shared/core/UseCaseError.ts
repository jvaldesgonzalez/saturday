import { Logger } from '@nestjs/common';
import { IUseCaseError } from './interfaces/IUseCaseError';

export abstract class UseCaseError implements IUseCaseError {
  public readonly message: string;
  public readonly context: string;
  public readonly data?: any;
  constructor({ message, context, data }: IUseCaseError) {
    Logger.error(`${message}`, null, context);
    this.message = message;
    this.context = context;
    this.data = data;
  }
}
