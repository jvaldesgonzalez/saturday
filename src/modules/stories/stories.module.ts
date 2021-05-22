import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { StoryRepository } from './infrascruture/repositories/implementations/story.repository';

@Module({
  imports: [DataAccessModule],
  providers: [
    {
      provide: 'IStoryRepository',
      useClass: StoryRepository,
    },
  ],
})
export class StoryModule {}
