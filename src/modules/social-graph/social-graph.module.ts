import { Module } from '@nestjs/common';
import {
  EventsGraphController,
  PartnersGraphController,
  SocialGraphController,
  UsersGraphController,
} from './social-graph.controller';
import { BlockService } from './social-services/block/block.service';
import { FollowService } from './social-services/follow/follow.service';
import { FriendRequestService } from './social-services/friend-request/friend-request.service';
import { FriendService } from './social-services/friend/friend.service';
import { LikeService } from './social-services/like/like.service';
import { ShareService } from './social-services/share/share.service';
import { ViewStoryService } from './social-services/view-story/view-story.service';

@Module({
  providers: [
    LikeService,
    FollowService,
    ViewStoryService,
    FriendRequestService,
    FriendService,
    ShareService,
    BlockService,
  ],
  controllers: [
    SocialGraphController,
    UsersGraphController,
    PartnersGraphController,
    EventsGraphController,
  ],
})
export class SocialGraphModule {}
