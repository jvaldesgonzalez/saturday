import { Guard } from 'src/shared/core/Guard';
import { Fail, Ok, Result } from 'src/shared/core/Result';
import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';
import { Multimedia } from 'src/shared/domain/multimedia.value';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { PublisherRef } from './publisherRef.entity';

type StoryProps = {
  publisher: PublisherRef;
  createdAt: Date;
  updatedAt: Date;
  multimedia: Multimedia;
  attachedText?: string;
};
export class Story extends AggregateDomainEntity<StoryProps> {
  public readonly __brand: void;

  public get publisher(): PublisherRef {
    return this.props.publisher;
  }

  public get multimedia(): Multimedia {
    return this.props.multimedia;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public get attachedText(): string {
    return this.props.attachedText;
  }

  markDeleted(): Result<void> {
    return Ok();
  }

  public static new(
    props: Omit<StoryProps, 'createdAt' | 'updatedAt'>,
  ): Result<Story> {
    return Story.create(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      new UniqueEntityID(),
    );
  }

  public static create(props: StoryProps, id: UniqueEntityID): Result<Story> {
    const againstNil = Guard.againstNullOrUndefined(
      props.multimedia,
      'multimedia',
    );
    return againstNil.succeeded
      ? Ok(new Story(props, id))
      : Fail(againstNil.message);
  }
}
