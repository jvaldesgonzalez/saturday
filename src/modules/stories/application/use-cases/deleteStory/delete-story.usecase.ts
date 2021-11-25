import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { StoriesProviders } from 'src/modules/stories/providers/stories.providers';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { DeleteStoryDto } from '../../dtos/delete-story.dto';
import { IStoryRepository } from '../../interfaces/stories.repository.interface';
import { DeleteStoryErrors } from './delete-story.errors';

type Response = Either<
  AppError.UnexpectedError | DeleteStoryErrors.StoryNotFound,
  Result<void>
>;

@Injectable()
export class DeleteStory implements IUseCase<DeleteStoryDto, Response> {
  private _logger: Logger;

  constructor(
    @Inject(StoriesProviders.IStoryRepository) private _repo: IStoryRepository,
  ) {
    this._logger = new Logger('DeleteStoryUseCase');
  }

  async execute(request: DeleteStoryDto): Promise<Response> {
    this._logger.log('Executing...');
    try {
      const story = await this._repo.findById(request.storyId);
      console.log(story);
      if (
        !story ||
        !story.publisher.equals(new UniqueEntityID(request.partnerId))
      )
        return left(
          new DeleteStoryErrors.StoryNotFound(
            new UniqueEntityID(request.storyId),
          ),
        );

      await this._repo.drop(story);
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
