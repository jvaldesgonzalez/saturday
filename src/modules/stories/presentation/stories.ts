import { ApiResponseProperty } from '@nestjs/swagger';

export class StoryDetail {
  @ApiResponseProperty()
  type: string;
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  attachedText?: string;
  @ApiResponseProperty()
  id: string;
}

export class Stories {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty({ type: [StoryDetail] })
  stories: StoryDetail[];
}
