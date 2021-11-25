import { DateTime } from 'neo4j-driver-core';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { Story } from '../../domain/story.domain';
import { StoryEntity } from '../entities/story.entity';

export class StoryMapper {
  public static fromPersistence(s: StoryEntity): Story {
    const publisherId = new UniqueEntityID(s.publisher);
    return Story.create(
      {
        publisher: publisherId,
        multimedia: { type: s.type, url: s.url } as Multimedia,
        attachedText: s.attachedText,
        createdAt: parseDate(s.createdAt),
        updatedAt: parseDate(s.updatedAt),
      },
      new UniqueEntityID(s.id),
    ).getValue();
  }

  public static toPersistence(s: Story): StoryEntity {
    return {
      id: s._id.toString(),
      publisher: s.publisher.toString(),
      type: s.multimedia.type,
      url: s.multimedia.url,
      attachedText: s.attachedText,
      createdAt: DateTime.fromStandardDate(s.createdAt),
      updatedAt: DateTime.fromStandardDate(s.updatedAt),
    };
  }
}
