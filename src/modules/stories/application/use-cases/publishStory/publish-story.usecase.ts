import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Story } from 'src/modules/stories/domain/story.domain';
import { StoriesProviders } from 'src/modules/stories/providers/stories.providers';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CreateStoryDto } from '../../dtos/create-story.dto';
import { IStoryRepository } from '../../interfaces/stories.repository.interface';

type Response = Either<
  AppError.UnexpectedError | AppError.ValidationError,
  Result<void>
>;

@Injectable()
export class CreateStory implements IUseCase<CreateStoryDto, Response> {
  private _logger: Logger;
  constructor(
    @Inject(StoriesProviders.IStoryRepository)
    private _repo: IStoryRepository,
  ) {
    this._logger = new Logger('CreateStoryUseCase');
  }
  async execute(request: CreateStoryDto): Promise<Response> {
    this._logger.log('Executing...');

    const publisher = new UniqueEntityID(request.publisher);
    const multimediaOrError = Multimedia.create(request.multimedia);
    const textOrError = request.attachedText ? request.attachedText : null;
    const storyOrError = Story.new({
      publisher,
      multimedia: multimediaOrError.getValue(),
      attachedText: textOrError,
    });
    if (storyOrError.isFailure)
      return left(new AppError.ValidationError(storyOrError.error.toString()));
    await this._repo.save(storyOrError.getValue());
    return right(Ok());
  }
}
