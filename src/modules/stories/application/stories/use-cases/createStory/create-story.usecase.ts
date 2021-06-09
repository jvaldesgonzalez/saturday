import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PublisherRef } from 'src/modules/events/domain/entities/publisherRef.entity';
import { Story } from 'src/modules/stories/domain/entities/story.entity';
import { IStoryRepository } from 'src/modules/stories/infrascruture/repositories/interfaces/story.repository.interface';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { CreateStoryDto } from '../../dtos/create-story.dto';

type CreateStoryUseCaseResponse = Either<
  AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@Injectable()
export class CreateStoryUseCase
  implements IUseCase<CreateStoryDto, CreateStoryUseCaseResponse> {
  private _logger: Logger;
  constructor(
    @Inject('IStoryRepository')
    private _repo: IStoryRepository,
  ) {
    this._logger = new Logger('CreateStoryUseCase');
  }
  async execute(request: CreateStoryDto): Promise<CreateStoryUseCaseResponse> {
    this._logger.log('Executing...');

    const publisherOrError = PublisherRef.create(request.publisher);
    const multimediaOrError = Multimedia.create(request.multimedia);
    const textOrError = request.attachedText ? request.attachedText : null;
    const combinedResult = Result.combine([
      multimediaOrError,
      publisherOrError,
    ]);
    if (combinedResult.isFailure) return left(Fail(combinedResult.error));
    const storyOrError = Story.new({
      publisher: publisherOrError.getValue(),
      multimedia: multimediaOrError.getValue(),
      attachedText: textOrError,
    });
    if (storyOrError.isFailure)
      return left(Fail(storyOrError.error.toString()));
    await this._repo.save(storyOrError.getValue());
    return right(Ok());
  }
}
