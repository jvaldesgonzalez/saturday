import { Inject, Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { IStoryRepository } from 'src/modules/stories/infrascruture/repositories/interfaces/story.repository.interface';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { DeleteStoryDto } from '../../dtos/delete-story.dto';
import { DeleteStoryErrors } from './delete-story.errors';

type DeleteStoryUseCaseResponse = Either<
  AppError.UnexpectedError | DeleteStoryErrors.StoryNotFound | Result<any>,
  Result<void>
>;

@Injectable()
export class DeleteStoryUseCase
  implements IUseCase<DeleteStoryDto, DeleteStoryUseCaseResponse> {
  private _logger: Logger;

  constructor(@Inject('IStoryRepository') private _repo: IStoryRepository) {
    this._logger = new Logger('DeleteStoryUseCase');
  }

  async execute(request: DeleteStoryDto): Promise<DeleteStoryUseCaseResponse> {
    this._logger.log('Executing...');
    try {
      const story = await this._repo.findById(request.storyId);
      if (!story)
        return left(new DeleteStoryErrors.StoryNotFound(request.storyId));

      await this._repo.drop(story);
      return right(Ok());
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }
}
