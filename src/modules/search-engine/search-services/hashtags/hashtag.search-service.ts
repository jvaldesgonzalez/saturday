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
import { HashtagItem } from '../../search-results/hashtag.search-result';
import { HashtagQuery } from './hashtag.query';

@Injectable()
export class HashtagSearchService implements ISearchService<HashtagItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: HashtagQuery,
    skip: number,
    limit: number,
    _requesterId?: string,
  ): Promise<ISearchResult<HashtagItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<HashtagItem>
    >(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('search_engine',$search) yield node, score
				WHERE node:Hashtag
				MATCH (node)--(p:Publication)
				RETURN {
    			data: {
						word:node.word,
						type:"hashtag",
						id:node.id,
						publications:count(distinct p)
					},
    			score:score
				} as hashtag
				ORDER BY hashtag.data.publications
			`,
      )
        .bind({ search: q.processedQuery })
        .skip(skip)
        .limit(limit),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(`
				CALL db.index.fulltext.queryNodes('search_engine','${q.processedQuery}') yield node, score
				WHERE node:Hashtag
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
