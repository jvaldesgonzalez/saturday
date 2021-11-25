import { DateTime } from 'neo4j-driver-core';
import { MultimediaType } from 'src/shared/domain/multimedia.value';

class Story {
  type: MultimediaType;
  url: string;
  id: string;
  createdAt: DateTime<number>;
  attachedText: string;
  viewed?: string;
}

export class StoryReadFromDBEntity {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  stories: Story[];
}
