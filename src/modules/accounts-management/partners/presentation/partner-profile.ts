import { ApiResponseProperty, OmitType } from '@nestjs/swagger';
import { AccountProfile } from '../../common/presentation/account-profile';
import { PartnerPlace } from '../domain/value-objects/partner-place.value';

class UnknownField {
  @ApiResponseProperty()
  header: string;
  @ApiResponseProperty()
  body: string;
  @ApiResponseProperty()
  inline: boolean;
}

type PartnerDescription = UnknownField[];

class FriendFollowersPreview {
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  id: string;
  @ApiResponseProperty()
  avatar: string;
  @ApiResponseProperty()
  fullname: string;
}

export class PartnerProfile extends AccountProfile {
  @ApiResponseProperty()
  businessName: string;
  @ApiResponseProperty({ type: [UnknownField] })
  aditionalBusinessData: PartnerDescription;
  @ApiResponseProperty()
  followers: number;
  @ApiResponseProperty()
  events: number;
  @ApiResponseProperty()
  totalFriendsWhoFollowThis: number;
  @ApiResponseProperty()
  IFollowThis: boolean;
  @ApiResponseProperty({ type: [FriendFollowersPreview] })
  friends: [FriendFollowersPreview];
}

export class PartnerMyProfile extends OmitType(PartnerProfile, [
  'totalFriendsWhoFollowThis',
  'IFollowThis',
  'friends',
] as const) {
  place?: PartnerPlace;
}
