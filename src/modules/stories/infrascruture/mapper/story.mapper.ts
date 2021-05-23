import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { PublisherRef } from '../../domain/entities/publisherRef.entity';
import { Story } from '../../domain/entities/story.entity';
import { StoryEntity } from '../entities/story.entity';

export class StoryMapper {
  public static PersistentToDomain(s: StoryEntity): Story {
    const publisherOrError = PublisherRef.create(s.publisher);
    return Story.create(
      {
        publisher: publisherOrError.getValue(),
        multimedia: s.multimedia as Multimedia,
        attachedText: s.attachedText,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      },
      new UniqueEntityID(s.id),
    ).getValue();
  }

  public static DomainToPersistent(s: Story): StoryEntity {
    return {
      id: s._id.toString(),
      publisher: s.publisher._id.toString(),
      multimedia: { type: s.multimedia.type, url: s.multimedia.url },
      attachedText: s.attachedText,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}
