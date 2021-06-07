import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
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
    ...storiesControllers,
  ],
  controllers: [StoriesRouter],
})
export class StoriesModule {}
