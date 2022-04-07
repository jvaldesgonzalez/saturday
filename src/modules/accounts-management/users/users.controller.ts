import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { JWTClaim } from '../auth/login-payload.type';
import { RemoveUser } from './application/use-cases/remove-user/remove-user.usecase';
import { UpdateUserErrors } from './application/use-cases/update-user/update-user.errors';
import { UpdateUser } from './application/use-cases/update-user/update-user.usecase';
import { UpdateUserBody } from './presentation/update-user';
import { UsersReadService } from './users.read-service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readService: UsersReadService,
    private updateProfile: UpdateUser,
    private removeUser: RemoveUser,
  ) {}

  @Get('/me/profile')
  @Roles(EnumRoles.Client)
  async getProfile(@CurrentUser() payload: JWTClaim) {
    return await this.readService.getMyProfile(payload.id);
  }

  @Get('/:userId/profile')
  async getUserProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getProfile(payload.id, userId);
  }

  @Put('/me/profile')
  async updateUserProfile(
    @Body() data: UpdateUserBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.updateProfile.execute({
      ...data,
      id: payload.id,
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

  @Delete('')
  async removeUserData(@CurrentUser() payload: JWTClaim) {
    const result = await this.removeUser.execute({
      userId: payload.id,
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
