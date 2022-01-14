import {
  Body,
  ConflictException,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { CurrentUser } from '../accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from '../accounts-management/auth/login-payload.type';
import { CreateNotification } from '../notifications/application/use-cases/createNotification/create-notification.usecase';
import { NotificationType } from '../notifications/enums/notification-type';
import { BlockInteraction } from './social-services/block/block.interaction';
import { BlockService } from './social-services/block/block.service';
import {
  FollowBody,
  FollowInteraction,
} from './social-services/follow/follow.interaction';
import { FollowService } from './social-services/follow/follow.service';
import {
  FriendRequestBody,
  FriendRequestInteraction,
} from './social-services/friend-request/friend-request.interaction';
import { FriendRequestService } from './social-services/friend-request/friend-request.service';
import { FriendInteraction } from './social-services/friend/friend.interaction';
import { FriendService } from './social-services/friend/friend.service';
import {
  LikeBody,
  LikeInteraction,
} from './social-services/like/like.interaction';
import { LikeService } from './social-services/like/like.service';
import {
  ShareBody,
  ShareInteraction,
} from './social-services/share/share.interaction';
import { ShareService } from './social-services/share/share.service';
import {
  ViewStoryBody,
  ViewStoryInteraction,
} from './social-services/view-story/view-story.interaction';
import { ViewStoryService } from './social-services/view-story/view-story.service';

@ApiBearerAuth()
@ApiTags('interactions')
@Controller('interactions')
export class SocialGraphController {
  constructor(
    private like: LikeService,
    private follow: FollowService,
    private friendRequest: FriendRequestService,
    private friend: FriendService,
    private viewStory: ViewStoryService,
    private share: ShareService,
    private block: BlockService,
    private notify: CreateNotification,
  ) {}

  @Post('/add-to-favorites')
  async makeLike(@Body() data: LikeBody, @CurrentUser() payload: JWTClaim) {
    const interaction = new LikeInteraction(new UniqueEntityID(data.eventId));
    if (!(await this.like.isPosible(interaction)))
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.like.save(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/share/')
  async makeShare(@Body() data: ShareBody, @CurrentUser() payload: JWTClaim) {
    if (data.shareWith.length == 0) {
      await this.share.saveForFriends(
        new UniqueEntityID(payload.id),
        new UniqueEntityID(data.eventId),
      );
      return;
    }
    const interaction = new ShareInteraction(
      data.shareWith.map((uuid) => new UniqueEntityID(uuid)),
      new UniqueEntityID(data.eventId),
    );
    if (!(await this.share.isPosible(interaction)))
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.share.save(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/follow-partner/')
  async makeFollow(@Body() data: FollowBody, @CurrentUser() payload: JWTClaim) {
    const interaction = new FollowInteraction(
      new UniqueEntityID(data.partnerId),
    );
    if (!(await this.follow.isPosible(interaction)))
      throw new ConflictException(
        'Cant create follow interaction with this params',
      );
    await this.follow.save(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/send-friend-request')
  async makeFriendRequest(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    if (
      !(await this.friendRequest.isPosible(
        interaction,
        new UniqueEntityID(payload.id),
      ))
    )
      throw new ConflictException(
        'Cant create friend-request interaction with this params',
      );
    await this.friendRequest.save(new UniqueEntityID(payload.id), interaction);
    await this.notify.execute({
      userId: payload.id,
      recipientId: [data.userId],
      type: NotificationType.FriendRequest,
    });
  }

  @Post('/accept-friend-request')
  async makeFriend(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new FriendInteraction(new UniqueEntityID(data.userId));
    if (
      !(await this.friend.isPosible(
        interaction,
        new UniqueEntityID(payload.id),
      ))
    )
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.friend.save(new UniqueEntityID(payload.id), interaction);
    await this.notify.execute({
      userId: payload.id,
      recipientId: [data.userId],
      type: NotificationType.NewFriend,
    });
  }

  @Post('/view-story/')
  async makeViewStory(
    @Body() data: ViewStoryBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new ViewStoryInteraction(
      new UniqueEntityID(data.storyId),
    );
    if (!(await this.viewStory.isPosible(interaction)))
      throw new ConflictException(
        'Cant create follow interaction with this params',
      );
    await this.viewStory.save(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/block')
  async blockUser(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new BlockInteraction(new UniqueEntityID(data.userId));
    if (!(await this.block.isPosible(interaction)))
      throw new ConflictException(
        'Cant create block interaction with this params',
      );
    await this.block.save(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/remove-from-favorites')
  async undoLike(@Body() data: LikeBody, @CurrentUser() payload: JWTClaim) {
    const interaction = new LikeInteraction(new UniqueEntityID(data.eventId));
    await this.like.drop(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/unfollow-partner/')
  async undoFollow(@Body() data: FollowBody, @CurrentUser() payload: JWTClaim) {
    const interaction = new FollowInteraction(
      new UniqueEntityID(data.partnerId),
    );
    await this.follow.drop(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/cancel-friend-request')
  async undoFriendRequest(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    await this.friendRequest.drop(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/decline-friend-request')
  async declineFriendRequest(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    await this.friendRequest.drop(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/remove-from-friends')
  async undoFriend(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    await this.friend.drop(new UniqueEntityID(payload.id), interaction);
  }

  @Post('/unblock')
  async unblockUser(
    @Body() data: FriendRequestBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const interaction = new BlockInteraction(new UniqueEntityID(data.userId));
    await this.block.drop(new UniqueEntityID(payload.id), interaction);
  }
}

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersGraphController {
  constructor(
    private like: LikeService,
    private follow: FollowService,
    private friendRequest: FriendRequestService,
    private friend: FriendService,
  ) {}

  @Get('/me/followees')
  @ApiQuery({ name: 'q', allowEmptyValue: true })
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  async getFollowees(
    @Query('q') q = '',
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.follow.getOutgoings(
      new UniqueEntityID(payload.id),
      skip,
      limit,
      q,
    );
  }

  @Get('/me/friends')
  @ApiQuery({ name: 'q', allowEmptyValue: true })
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  async getFriends(
    @Query('q') q = '',
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.friend.getOutgoings(
      new UniqueEntityID(payload.id),
      skip,
      limit,
      q,
    );
  }

  @Get('/me/friend-requests')
  @ApiQuery({ name: 'q', allowEmptyValue: true })
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  async getFriendRequests(
    @Query('q') q = '',
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.friendRequest.getOutgoings(
      new UniqueEntityID(payload.id),
      skip,
      limit,
      q,
    );
  }

  @Get('/me/favorites')
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  async getLiked(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.like.getOutgoings(new UniqueEntityID(payload.id), skip, limit);
  }

  //TODO: add is_private filter
  @Get('/:userId/favorites')
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiParam({ name: 'userId', type: String })
  async getLikedByOther(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.like.getOutgoinsFromRemoteNode(
      new UniqueEntityID(userId),
      skip,
      limit,
      new UniqueEntityID(payload.id),
    );
  }

  @Get('/:userId/followees')
  @ApiQuery({ name: 'q', allowEmptyValue: true })
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiParam({ name: 'userId', type: String })
  @ApiQuery({ name: 'only_followees', type: Boolean, allowEmptyValue: true })
  async getFolloweesByOther(
    @Query('q') searchTerm = '',
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Query('only_followees', ParseBoolPipe) onlyFollowees = false,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.follow.getOutgoingsFromRemoteNode(
      new UniqueEntityID(userId),
      skip,
      limit,
      searchTerm,
      new UniqueEntityID(payload.id),
      onlyFollowees,
    );
  }

  @Get('/:userId/friends')
  @ApiQuery({ name: 'q', allowEmptyValue: true })
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiParam({ name: 'userId', type: String })
  @ApiQuery({ name: 'only_friends', type: Boolean, allowEmptyValue: true })
  async getFriendsOfOther(
    @Query('q') searchTerm = '',
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Query('only_friends', ParseBoolPipe) onlyFriends = false,
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.friend.getIngoings({
      from: new UniqueEntityID(payload.id),
      skip,
      limit,
      onlyFriends,
      searchTerm,
      interaction: new FriendInteraction(new UniqueEntityID(userId)),
    });
  }
}

@ApiBearerAuth()
@ApiTags('events')
@Controller('events')
export class EventsGraphController {
  constructor(private like: LikeService) {}

  //Users who like an event
  @Get('/:eventId/interested-users')
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'only_friends', type: Boolean, allowEmptyValue: true })
  @ApiQuery({ name: 'q', type: String, allowEmptyValue: true })
  @ApiParam({ name: 'eventId', type: String })
  async getUsersInterested(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Query('only_friends', ParseBoolPipe) onlyFriends = false,
    @Query('q') searchTerm = '',
    @Param('eventId') eventId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.like.getIngoings({
      from: new UniqueEntityID(payload.id),
      skip,
      limit,
      onlyFriends,
      searchTerm,
      interaction: new LikeInteraction(new UniqueEntityID(eventId)),
    });
  }
}

@ApiBearerAuth()
@ApiTags('partners')
@Controller('partners')
export class PartnersGraphController {
  constructor(private follow: FollowService) {}

  @Get('/:partnerId/followers')
  @ApiQuery({ name: 'q', allowEmptyValue: true })
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'only_friends', type: Boolean, allowEmptyValue: true })
  @ApiQuery({ name: 'skip', type: Number })
  async getFolloweesOfUser(
    @Query('q') searchTerm = '',
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Query('only_friends', ParseBoolPipe) onlyFriends = false,
    @Param('partnerId', ParseUUIDPipe) partnerId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return this.follow.getIngoings({
      from: new UniqueEntityID(payload.id),
      skip,
      limit,
      onlyFriends,
      searchTerm,
      interaction: new FollowInteraction(new UniqueEntityID(partnerId)),
    });
  }
}
