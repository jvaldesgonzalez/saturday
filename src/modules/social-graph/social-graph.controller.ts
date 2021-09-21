import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { FollowInteraction } from './social-services/follow/follow.interaction';
import { FollowService } from './social-services/follow/follow.service';
import { FriendRequestInteraction } from './social-services/friend-request/friend-request.interaction';
import { FriendRequestService } from './social-services/friend-request/friend-request.service';
import { FriendInteraction } from './social-services/friend/friend.interaction';
import { FriendService } from './social-services/friend/friend.service';
import { LikeInteraction } from './social-services/like/like.interaction';
import { LikeService } from './social-services/like/like.service';
import {
  ShareBody,
  ShareInteraction,
} from './social-services/share/share.interaction';
import { ShareService } from './social-services/share/share.service';
import { ViewStoryInteraction } from './social-services/view-story/view-story.interaction';
import { ViewStoryService } from './social-services/view-story/view-story.service';

@ApiTags('social-graph')
@Controller('social-graph')
export class SocialGraphController {
  constructor(
    private like: LikeService,
    private follow: FollowService,
    private friendRequest: FriendRequestService,
    private friend: FriendService,
    private viewStory: ViewStoryService,
    private share: ShareService,
  ) {}

  @Post('/me/likes/:to')
  async makeLike(@Param('to') to: string) {
    const interaction = new LikeInteraction(new UniqueEntityID(to));
    if (!(await this.like.isPosible(interaction)))
      throw new ConflictException(
        'Cant create like interaction with this params',
      );
    await this.like.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/me/shares/:to')
  async makeShare(@Param('to') to: string, @Body() data: ShareBody) {
    const interaction = new ShareInteraction(
      new UniqueEntityID(to),
      new UniqueEntityID(data.publicationId),
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

  @Post('/me/follows/:to')
  async makeFollow(@Param('to') to: string) {
    const interaction = new FollowInteraction(new UniqueEntityID(to));
    if (!(await this.follow.isPosible(interaction)))
      throw new ConflictException(
        'Cant create follow interaction with this params',
      );
    await this.follow.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/me/friend-requests/:to')
  async makeFriendRequest(@Param('to') to: string) {
    const interaction = new FriendRequestInteraction(new UniqueEntityID(to));
    if (!(await this.friendRequest.isPosible(interaction)))
      throw new ConflictException(
        'Cant create friend-request interaction with this params',
      );
    await this.friendRequest.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Post('/me/friends/:to')
  async makeFriend(@Param('to') to: string) {
    const interaction = new FriendInteraction(new UniqueEntityID(to));
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

  @Post('/me/view-stories/:to')
  async makeViewStory(@Param('to') to: string) {
    const interaction = new ViewStoryInteraction(new UniqueEntityID(to));
    if (!(await this.viewStory.isPosible(interaction)))
      throw new ConflictException(
        'Cant create follow interaction with this params',
      );
    await this.viewStory.save(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Delete('/me/likes/:to')
  async undoLike(@Param('to') to: string) {
    const interaction = new LikeInteraction(new UniqueEntityID(to));
    await this.like.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Delete('/me/follows/:to')
  async undoFollow(@Param('to') to: string) {
    const interaction = new FollowInteraction(new UniqueEntityID(to));
    await this.follow.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Delete('/me/friend-requests/:to')
  async undoFriendRequest(@Param('to') to: string) {
    const interaction = new FriendRequestInteraction(new UniqueEntityID(to));
    await this.friendRequest.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Delete('/me/friends/:to')
  async undoFriend(@Param('to') to: string) {
    const interaction = new FriendRequestInteraction(new UniqueEntityID(to));
    await this.friend.drop(
      new UniqueEntityID('777cc88c-2e3f-4eb4-ac81-14c9323c541d'),
      interaction,
    );
  }

  @Get('/me/follows')
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

  @Get('/me/likes')
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

  @Get('/:eventId/liked-by')
  @ApiQuery({ name: 'take', type: Number })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'only_friends', type: Boolean, allowEmptyValue: true })
  @ApiQuery({ name: 'q', type: String, allowEmptyValue: true })
  @ApiParam({ name: 'eventId', type: String })
  async getUsersInterested(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @Query('only_friends') onlyFriends = false,
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
