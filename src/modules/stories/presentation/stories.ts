import { ApiResponseProperty, OmitType } from '@nestjs/swagger';

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
  @ApiResponseProperty()
  viewed: boolean;
}
export class UserInfo {
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  avatar: string;
}

export class Stories {
  @ApiResponseProperty({ type: UserInfo })
  user: UserInfo;
  @ApiResponseProperty({ type: [StoryDetail] })
  stories: StoryDetail[];
}

export class StoriesByHost extends OmitType(StoryDetail, ['viewed'] as const) {
  @ApiResponseProperty()
  views: number;
}
