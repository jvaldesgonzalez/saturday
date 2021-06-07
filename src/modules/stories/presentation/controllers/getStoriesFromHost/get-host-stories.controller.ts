import { Inject, Injectable } from '@nestjs/common';
import { IStoryRepository } from 'src/modules/stories/infrascruture/repositories/interfaces/story.repository.interface';
import { BaseController } from 'src/shared/http/BaseController';
import { GetStoriesFromHostRequest } from './request';
import { GetStoriesFromHostResponse } from './response';

@Injectable()
export class GetStoriesFromHostController extends BaseController<
  GetStoriesFromHostRequest,
  GetStoriesFromHostResponse[]
> {
  constructor(
    @Inject('IStoryRepository') private _storiesRepository: IStoryRepository,
  ) {
    super();
  }
  async executeImpl(
    req: GetStoriesFromHostRequest,
  ): Promise<GetStoriesFromHostResponse[]> {
    const stories = await this._storiesRepository.getByHost(req.hostId);
    return stories;
  }
}
