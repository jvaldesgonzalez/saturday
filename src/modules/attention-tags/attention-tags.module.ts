import { Module } from '@nestjs/common';
import { CorrectTagsForEvents } from './cron-jobs/correct-tags.cron';

@Module({
  providers: [CorrectTagsForEvents],
})
export class AttentionTagsModule {}
