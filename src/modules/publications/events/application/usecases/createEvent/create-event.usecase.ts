import { Inject } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CreateEventDto } from '../../dtos/create-event.dto';
import { IEventRepository } from '../../interfaces/event.repository';
import { Event } from '../../../domain/event.domain';

export type CreateEventUseCaseResponse = Either<
  AppError.UnexpectedError | Result<any>,
  Result<void>
>;

// @Injectable()
// export class CreateEventUseCase
//   implements IUseCase<CreateEventDto, CreateEventUseCaseResponse>
// {
//   private _logger: Logger;
//   constructor(
//     @Inject('IEventRepository') private readonly _repository: IEventRepository,
//   ) {
//     this._logger = new Logger('CreateEventUseCase');
//   }

//   async execute(request: CreateEventDto): Promise<CreateEventUseCaseResponse> {
//     this._logger.log('Executing...');

//     const publisher = new UniqueEntityID(request.publisher);
//     const categories = request.categories.map((ct) => new UniqueEntityID(ct));
//     const collaborators = (request.collaborators || []).map(
//       (col) => new UniqueEntityID(col),
//     );
//     const event = Event.new({
//       ...request,
//       publisher,
//       categories,
//       collaborators,
//       newOccurrences: request.occurrences,
//     }).getValue();

//     try {
//       this._logger.log(event);
//       await this._repository.save(event);
//       for (const occurrence of request.occurrences) {
//         await this.createOccurrenceUseCase.execute({
//           eventId: event._id.toString(),
//           ...occurrence,
//         });
//       }
//       return right(Ok());
//     } catch (error) {
//       return left(new AppError.UnexpectedError());
//     }
//   }
// }
