import { Module } from '@nestjs/common';
import { DataAccessModule } from 'src/shared/modules/data-access/data-access.module';
import { SearchEngineController } from './search-engine.controller';
import { AccountSearchService } from './search-services/accounts/accounts.search-service';
import { HashtagSearchService } from './search-services/hashtags/hashtag.search-service';

@Module({
  imports: [DataAccessModule],
  providers: [HashtagSearchService, AccountSearchService],
  controllers: [SearchEngineController],
})
export class SearchEngineModule {}
