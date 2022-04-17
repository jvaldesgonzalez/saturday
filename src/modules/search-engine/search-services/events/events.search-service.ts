import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import { DateTime } from 'neo4j-driver-core';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import {
  ISearchResult,
  ISearchResultItem,
} from '../../common/search-result.interface';
import { ISearchService } from '../../common/search-service.interface';
import { EventItem } from '../../search-results/event.search-result';
import { EventQuery } from './events.query';

@Injectable()
export class EventSearchService implements ISearchService<EventItem> {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async search(
    q: EventQuery,
    skip: number,
    limit: number,
    requesterId: string,
    dateInterval?: { from: Date; to: Date },
    categories: string[] = [],
    priceInterval?: { from: number; to: number },
    locationId?: string,
  ): Promise<ISearchResult<EventItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<EventItem>
    >(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('search_engine','${
          q.processedQuery
        }') yield node, score
				WHERE node:Event
				MATCH (l:Location)--(place:Place)--(node)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE true
				${
          dateInterval
            ? 'AND size([(node)--(occ:EventOccurrence) WHERE ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate ) OR ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate )| occ]) > 0 '
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN {
    			data: {
						id: node.id,
						publisher: publisher{.id, .avatar, .username},
						type:"event",
						name:node.name,
						multimedia: node.multimedia,
						place: place {.name, .address},
						dateTimeInit:node.dateTimeInit,
						dateTimeEnd:node.dateTimeEnd,
						basePrice:node.basePrice
					},
    			score:score
				}
			`,
      )
        .bind({
          categories,
          fromDate: dateInterval
            ? new DateTime(
                dateInterval.from.getFullYear(),
                dateInterval.from.getMonth() + 1,
                dateInterval.from.getDate(),
                dateInterval.from.getHours(),
                dateInterval.from.getMinutes(),
                dateInterval.from.getSeconds(),
                dateInterval.from.getMilliseconds() * 1000000,
                dateInterval.from.getTimezoneOffset(),
              )
            : null,
          toDate: dateInterval
            ? new DateTime(
                dateInterval.to.getFullYear(),
                dateInterval.to.getMonth() + 1,
                dateInterval.to.getDate(),
                dateInterval.to.getHours(),
                dateInterval.to.getMinutes(),
                dateInterval.to.getSeconds(),
                dateInterval.to.getMilliseconds() * 1000000,
                dateInterval.to.getTimezoneOffset(),
              )
            : null,
          fromPrice: priceInterval ? priceInterval.from : null,
          toPrice: priceInterval ? priceInterval.to : null,
          locationId: locationId,
        })
        .skip(skip)
        .limit(limit)
        .map((r) => {
          r.data.multimedia = TextUtils.escapeAndParse(r.data.multimedia);
          r.data.dateTimeEnd = parseDate(r.data.dateTimeEnd);
          r.data.dateTimeInit = parseDate(r.data.dateTimeInit);
          return r;
        }),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				CALL db.index.fulltext.queryNodes('search_engine','${
          q.processedQuery
        }') yield node, score
				WHERE node:Event
				MATCH (l:Location)--(place:Place)--(node)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)--(occ:EventOccurrence)
				WHERE node.dateTimeEnd >= datetime()
				${
          dateInterval
            ? 'AND size([(node)--(occ:EventOccurrence) WHERE ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate ) OR ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate )| occ]) > 0 '
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN count(node)
				`,
      ).bind({
        categories,
        fromDate: dateInterval
          ? new DateTime(
              dateInterval.from.getFullYear(),
              dateInterval.from.getMonth() + 1,
              dateInterval.from.getDate(),
              dateInterval.from.getHours(),
              dateInterval.from.getMinutes(),
              dateInterval.from.getSeconds(),
              dateInterval.from.getMilliseconds() * 1000000,
              dateInterval.from.getTimezoneOffset(),
            )
          : null,
        toDate: dateInterval
          ? new DateTime(
              dateInterval.to.getFullYear(),
              dateInterval.to.getMonth() + 1,
              dateInterval.to.getDate(),
              dateInterval.to.getHours(),
              dateInterval.to.getMinutes(),
              dateInterval.to.getSeconds(),
              dateInterval.to.getMilliseconds() * 1000000,
              dateInterval.to.getTimezoneOffset(),
            )
          : null,
        fromPrice: priceInterval ? priceInterval.from : null,
        toPrice: priceInterval ? priceInterval.to : null,
        locationId: locationId,
      }),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }

  async filter(
    skip: number,
    limit: number,
    requesterId: string,
    dateInterval?: { from: Date; to: Date },
    categories: string[] = [],
    priceInterval?: { from: number; to: number },
    locationId?: string,
  ): Promise<ISearchResult<EventItem>> {
    const items = await this.persistenceManager.query<
      ISearchResultItem<EventItem>
    >(
      QuerySpecification.withStatement(
        `
				MATCH (l:Location)--(place:Place)--(node:Event)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE node.dateTimeEnd >= datetime()
				${
          dateInterval
            ? 'AND size([(node)--(occ:EventOccurrence) WHERE ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate ) OR ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate )| occ]) > 0 '
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN {
    			data: {
						id: node.id,
						publisher: publisher{.id, .avatar, .username},
						type:"event",
						name:node.name,
						multimedia: node.multimedia,
						place: place {.name, .address},
						dateTimeInit:node.dateTimeInit,
						dateTimeEnd:node.dateTimeEnd,
						basePrice:node.basePrice
					},
    			score:1.0
				}
			`,
      )
        .bind({
          categories,
          fromDate: dateInterval
            ? new DateTime(
                dateInterval.from.getFullYear(),
                dateInterval.from.getMonth() + 1,
                dateInterval.from.getDate(),
                dateInterval.from.getHours(),
                dateInterval.from.getMinutes(),
                dateInterval.from.getSeconds(),
                dateInterval.from.getMilliseconds() * 1000000,
                dateInterval.from.getTimezoneOffset(),
              )
            : null,
          toDate: dateInterval
            ? new DateTime(
                dateInterval.to.getFullYear(),
                dateInterval.to.getMonth() + 1,
                dateInterval.to.getDate(),
                dateInterval.to.getHours(),
                dateInterval.to.getMinutes(),
                dateInterval.to.getSeconds(),
                dateInterval.to.getMilliseconds() * 1000000,
                dateInterval.to.getTimezoneOffset(),
              )
            : null,
          fromPrice: priceInterval ? priceInterval.from : null,
          toPrice: priceInterval ? priceInterval.to : null,
          locationId: locationId,
        })
        .skip(skip)
        .limit(limit)
        .map((r) => {
          r.data.multimedia = TextUtils.escapeAndParse(r.data.multimedia);
          r.data.dateTimeEnd = parseDate(r.data.dateTimeEnd);
          r.data.dateTimeInit = parseDate(r.data.dateTimeInit);
          return r;
        }),
    );
    const total = await this.persistenceManager.getOne<number>(
      QuerySpecification.withStatement(
        `
				MATCH (l:Location)--(place:Place)--(node:Event)-[:PUBLISH_EVENT]-(publisher:Partner),
				(c:Category)--(node)
				WHERE node.dateTimeEnd >= datetime()
				${
          dateInterval
            ? 'AND size([(node)--(occ:EventOccurrence) WHERE ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate ) OR ( occ.dateTimeInit >= $fromDate AND occ.dateTimeInit <= $toDate )| occ]) > 0 '
            : ''
        } ${categories.some((i) => i) ? 'AND c.id IN $categories' : ''}
        ${locationId ? 'AND l.id = $locationId' : ''}
				${
          priceInterval
            ? 'AND node.basePrice >= $fromPrice AND node.topPrice <= $toPrice'
            : ''
        } 
				RETURN count(node)
				`,
      ).bind({
        categories,
        fromDate: dateInterval
          ? new DateTime(
              dateInterval.from.getFullYear(),
              dateInterval.from.getMonth() + 1,
              dateInterval.from.getDate(),
              dateInterval.from.getHours(),
              dateInterval.from.getMinutes(),
              dateInterval.from.getSeconds(),
              dateInterval.from.getMilliseconds() * 1000000,
              dateInterval.from.getTimezoneOffset(),
            )
          : null,
        toDate: dateInterval
          ? new DateTime(
              dateInterval.to.getFullYear(),
              dateInterval.to.getMonth() + 1,
              dateInterval.to.getDate(),
              dateInterval.to.getHours(),
              dateInterval.to.getMinutes(),
              dateInterval.to.getSeconds(),
              dateInterval.to.getMilliseconds() * 1000000,
              dateInterval.to.getTimezoneOffset(),
            )
          : null,
        fromPrice: priceInterval ? priceInterval.from : null,
        toPrice: priceInterval ? priceInterval.to : null,
        locationId: locationId,
      }),
    );
    return {
      items,
      total,
      pageSize: items.length,
      current: skip,
    };
  }
}
