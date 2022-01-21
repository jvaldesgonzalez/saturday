import { Module } from '@nestjs/common';
import storiesUseCases from './application/use-cases';
import { RemoveStoriesDailyCron } from './cron-jobs/remove-stories-daily.cron';
import { StoryRepository } from './infrastructure/repository/stories.repository';
import { StoriesProviders } from './providers/stories.providers';
import { StoriesController } from './stories.controller';
import { StoriesReadService } from './stories.read-service';

@Module({
  providers: [
    StoriesReadService,
    {
      provide: StoriesProviders.IStoryRepository,
      useClass: StoryRepository,
    },
    ...storiesUseCases,
    RemoveStoriesDailyCron,
  ],
  controllers: [StoriesController],
})
export class StoriesModule {}
