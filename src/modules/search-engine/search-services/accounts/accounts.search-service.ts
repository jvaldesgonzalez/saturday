import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { Integer } from 'neo4j-driver-core';
import {
  ISearchResult,
  ISearchResultItem,
} from '../../common/search-result.interface';
import { ISearchService } from '../../common/search-service.interface';
import { AccountItem } from '../../search-results/account.search-result';
import { AccountQuery } from './account.query';

@Injectable()
export class HashtagSearchService implements ISearchService<AccountItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: AccountQuery,
    skip: number,
    limit: number,
  ): Promise<ISearchResult<AccountItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<AccountItem>
    >(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('accounts',${q.processedQuery}) yield node,score
				CALL apoc.when(node:User,'return 4 as result','return 3 as result') yield value
				RETURN value.result
			`,
      ).bind({ limit: Integer.fromInt(limit), skip: Integer.fromInt(skip) }),
    );
    console.log(items);
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(`
				CALL db.index.fulltext.queryNodes('accounts','${q.processedQuery}') yield node, score
				RETURN count(node)
				`),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
