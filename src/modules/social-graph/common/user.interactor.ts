export class UserInteractor {
  username: string;
  friendshipStatus: 'friend' | 'friend_request' | 'none';
  id: string;
  fullname: string;
  friendsInCommon?: number;
}
