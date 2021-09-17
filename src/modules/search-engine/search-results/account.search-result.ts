export class UserItem {
  type: 'user';
  fullname: string;
  username: string;
  id: string;
}

export class PartnerItem {
  type: 'partner';
  businessName: string;
  username: string;
  id: string;
}

export type AccountItem = UserItem | PartnerItem;
