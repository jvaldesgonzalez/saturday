import { ApiResponseProperty } from '@nestjs/swagger';

export class UserInteractor {
  friendshipStatus: 'friend' | 'friend_request' | 'none';
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  email: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty()
  fullname: string;
  @ApiResponseProperty()
  friendsInCommon: number;
}
