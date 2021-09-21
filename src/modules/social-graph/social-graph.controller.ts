import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
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
  ) {}

  @Post('/add-to-favorites')
  async makeLike(@Body() data: LikeBody) {
    const interaction = new LikeInteraction(new UniqueEntityID(data.eventId));
    if (!(await this.like.isPosible(interaction)))
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.like.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/share/')
  async makeShare(@Body() data: ShareBody) {
    const interaction = new ShareInteraction(
      new UniqueEntityID(data.shareWith),
      new UniqueEntityID(data.eventId),
    );
    if (!(await this.share.isPosible(interaction)))
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.share.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/follow-partner/')
  async makeFollow(@Body() data: FollowBody) {
    const interaction = new FollowInteraction(
      new UniqueEntityID(data.partnerId),
    );
    if (!(await this.follow.isPosible(interaction)))
      throw new ConflictException(
        'Cant create follow interaction with this params',
      );
    await this.follow.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/send-friend-request')
  async makeFriendRequest(@Body() data: FriendRequestBody) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    if (!(await this.friendRequest.isPosible(interaction)))
      throw new ConflictException(
        'Cant create friend-request interaction with this params',
      );
    await this.friendRequest.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/accept-friend-request')
  async makeFriend(@Body() data: FriendRequestBody) {
    const interaction = new FriendInteraction(new UniqueEntityID(data.userId));
    if (
      !(await this.friend.isPosible(
        interaction,
        new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      ))
    )
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.friend.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/view-story/')
  async makeViewStory(@Body() data: ViewStoryBody) {
    const interaction = new ViewStoryInteraction(
      new UniqueEntityID(data.storyId),
    );
    if (!(await this.viewStory.isPosible(interaction)))
      throw new ConflictException(
        'Cant create follow interaction with this params',
      );
    await this.viewStory.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/remove-from-favorites')
  async undoLike(@Body() data: LikeBody) {
    const interaction = new LikeInteraction(new UniqueEntityID(data.eventId));
    await this.like.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/unfollow-partner/')
  async undoFollow(@Body() data: FollowBody) {
    const interaction = new FollowInteraction(
      new UniqueEntityID(data.partnerId),
    );
    await this.follow.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/cancel-friend-requests')
  async undoFriendRequest(@Body() data: FriendRequestBody) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    await this.friendRequest.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/remove-from-friends')
  async undoFriend(@Body() data: FriendRequestBody) {
    const interaction = new FriendRequestInteraction(
      new UniqueEntityID(data.userId),
    );
    await this.friend.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }
}

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
  ) {
    return this.follow.getOutgoings(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
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
  ) {
    return this.friendRequest.getOutgoings(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
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
  ) {
    return this.like.getOutgoings(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      skip,
      limit,
    );
  }

  @Get('/favorites/:eventId')
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
  ) {
    return this.like.getIngoings({
      from: new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      skip,
      limit,
      onlyFriends,
      searchTerm,
      interaction: new LikeInteraction(new UniqueEntityID(eventId)),
    });
  }
}
