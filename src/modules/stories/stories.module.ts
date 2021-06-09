import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import storiesUseCases from './application/stories/use-cases';
import { StoryRepository } from './infrascruture/repositories/implementations/story.repository';
import storiesControllers from './presentation/controllers';
import { StoriesRouter } from './presentation/stories.router';

@Module({
  imports: [DataAccessModule],
  providers: [
    {
      provide: 'IStoryRepository',
      useClass: StoryRepository,
    },
    ...storiesUseCases,
    ...storiesControllers,
  ],
  controllers: [StoriesRouter],
})
export class StoriesModule {}
