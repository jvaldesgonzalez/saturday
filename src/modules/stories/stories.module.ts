import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesReadService } from './stories.read-service';

@Module({
  providers: [StoriesReadService],
  controllers: [StoriesController],
})
export class StoriesModule {}
