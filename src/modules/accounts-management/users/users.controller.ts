import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserErrors } from './application/use-cases/update-user/update-user.errors';
import { UpdateUser } from './application/use-cases/update-user/update-user.usecase';
import { UpdateUserBody } from './presentation/update-user';
import { UsersReadService } from './users.read-service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readService: UsersReadService,
    private updateProfile: UpdateUser,
  ) {}

  @Get('/me/profile')
  async getProfile() {
    return await this.readService.getMyProfile(
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    );
  }

  @Get('/:userId/profile')
  async getUserProfile(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.readService.getProfile(
      '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
      userId,
    );
  }

  @Put('/me/profile')
  async updateUserProfile(@Body() data: UpdateUserBody) {
    const result = await this.updateProfile.execute({
      ...data,
      id: '777cc88c-2e3f-4eb4-ac81-14c9323c541d',
    });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case UpdateUserErrors.UserNotFound:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
