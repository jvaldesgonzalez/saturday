import { Module } from '@nestjs/common';
import storiesUseCases from './application/use-cases';
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
  ],
  controllers: [StoriesController],
})
export class StoriesModule {}
