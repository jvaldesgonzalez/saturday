export class UserItem {
  type: 'user';
  fullname: string;
  username: string;
  id: string;
  friendshipStatus: 'friend' | 'friend_request' | 'none';
}

export class PartnerItem {
  type: 'partner';
  businessName: string;
  username: string;
  followers: number;
  id: string;
}

export type AccountItem = UserItem | PartnerItem;
