import { AtMost3List } from 'src/shared/typedefs/at-most-3-list';

class FriendInCommonPreview {
  username: string;
  avatar: string;
}

export class UserInteractor {
  username: string;
  friendshipStatus: 'friend' | 'friend_request' | 'none';
  id: string;
  fullname: string;
  friendsInCommon: number;
  friends?: AtMost3List<FriendInCommonPreview>;
}
