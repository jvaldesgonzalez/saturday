import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { SearchEngineController } from './search-engine.controller';
import { HashtagSearchService } from './search-services/hashtags/hashtag.search-service';

@Module({
  imports: [DataAccessModule],
  providers: [HashtagSearchService],
  controllers: [SearchEngineController],
})
export class SearchEngineModule {}
