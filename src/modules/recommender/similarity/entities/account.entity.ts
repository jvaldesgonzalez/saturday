export class DefaultAccountEntity {
  username: string;
  id: string;
  type: 'user' | 'partner';
  avatar: string;
}

export class UserEntity extends DefaultAccountEntity {
  type: 'user';
  friendsInCommon: number;
}

export class PartnerEntity extends DefaultAccountEntity {
  type: 'partner';
  followers: number;
}

export type SimilarAccount = UserEntity | PartnerEntity;
