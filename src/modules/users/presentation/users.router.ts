import {
  Get,
  Body,
  Controller,
  Post,
  Put,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { JWTClaims } from '../domain/value-objects/token.value';
import { ChangePasswordController } from './controllers/changePassword/change-password.controller';
import { ChangePasswordBody } from './controllers/changePassword/request';
import { ChangePasswordResponse } from './controllers/changePassword/response';
import { ChangeUsernameController } from './controllers/changeUsername/change-username.controller';
import { ChangeUsernameBody } from './controllers/changeUsername/request';
import { ChangeUsernameResponse } from './controllers/changeUsername/response';
import { CHeckUsernameController } from './controllers/checkUsername/check-username.controller';
import { CheckUsernameRequest } from './controllers/checkUsername/request';
import { CheckUsernameResponse } from './controllers/checkUsername/response';
import { CreateUserLocalController } from './controllers/createUserLocal/create-user-local.controller';
import { CreateUserLocalBody } from './controllers/createUserLocal/request';
import { CreateUserLocalResponse } from './controllers/createUserLocal/response';
import { EditProfileController } from './controllers/editProfile/edit-profile.controller';
import { EditProfileBody } from './controllers/editProfile/request';
import { EditProfileResponse } from './controllers/editProfile/response';
import { LoginUserController } from './controllers/loginUser/login-user.controller';
import { LoginUserRequest } from './controllers/loginUser/request';
import { LoginUserResponse } from './controllers/loginUser/response';
import { RefreshTokenController } from './controllers/refreshToken/refresh-token.controller';
import { RefreshTokenRequest } from './controllers/refreshToken/request';
import { RefreshTokenResponse } from './controllers/refreshToken/response';
import { UpdateAppVersionRequest } from './controllers/updateAppVersion/request';
import { UpdateAppVersionResponse } from './controllers/updateAppVersion/response';
import { UpdateAppVersionController } from './controllers/updateAppVersion/update-app-version.controller';
import { UpdateFirebasePushIdRequest } from './controllers/updateFirebasePushId/request';
import { UpdateFirebasePushIdResponse } from './controllers/updateFirebasePushId/response';
import { UpdateFirebasePushIdController } from './controllers/updateFirebasePushId/update-firebase-id.controller';
import { ViewProfileResponse } from './controllers/viewProfile/response';
import { ViewProfileController } from './controllers/viewProfile/view-profile.controller';

@ApiTags('users')
@ApiBearerAuth()
@Controller('auth')
export class UsersController {
  constructor(
    private createHostCtx: CreateUserLocalController,
    private loginUserCtx: LoginUserController,
    private refreshTokenCtx: RefreshTokenController,
    private checkUsernameCtx: CHeckUsernameController,
    private changeUsernameCtx: ChangeUsernameController,
    private viewProfileCtx: ViewProfileController,
    private changePassCtx: ChangePasswordController,
    private editProfileCtx: EditProfileController,
    private updateFirebaseIdCtx: UpdateFirebasePushIdController,
    private updateAppVersionCtx: UpdateAppVersionController,
  ) {}
  @Post('/local/:role/register')
  @ApiParam({ name: 'role', enum: EnumRoles })
  async createLocal(
    @Body() data: CreateUserLocalBody,
    @Param('role') role: string,
  ): Promise<CreateUserLocalResponse> {
    return this.createHostCtx.execute({ role: role as EnumRoles, ...data });
  }

  @Post('/local/login')
  async loginLocal(@Body() data: LoginUserRequest): Promise<LoginUserResponse> {
    return this.loginUserCtx.execute(data);
  }

  @Post('/refresh-token')
  async refreshToken(
    @Body() data: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return this.refreshTokenCtx.execute(data);
  }

  @Post('/username/check')
  async checkUsername(
    @Body() data: CheckUsernameRequest,
  ): Promise<CheckUsernameResponse> {
    return this.checkUsernameCtx.execute(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/username')
  async changeUsername(
    @CurrentUser() user: JWTClaims,
    @Body() data: ChangeUsernameBody,
  ): Promise<ChangeUsernameResponse> {
    return this.changeUsernameCtx.execute({ userId: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiOperation({ deprecated: true })
  async viewProfile(
    @CurrentUser() user: JWTClaims,
  ): Promise<ViewProfileResponse> {
    return this.viewProfileCtx.execute({ userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/password')
  async changePassword(
    @CurrentUser() user: JWTClaims,
    @Body() data: ChangePasswordBody,
  ): Promise<ChangePasswordResponse> {
    return this.changePassCtx.execute({ userId: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile')
  @ApiOperation({ deprecated: true })
  async editProfile(
    @CurrentUser() user: JWTClaims,
    @Body() data: EditProfileBody,
  ): Promise<EditProfileResponse> {
    return this.editProfileCtx.execute({ userId: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/app-version')
  async changeVersion(
    @CurrentUser() user: JWTClaims,
    @Body() data: UpdateAppVersionRequest,
  ): Promise<UpdateAppVersionResponse> {
    return this.updateAppVersionCtx.execute({ userId: user.id, ...data });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/firebase-push-id')
  async updateFirebaseId(
    @CurrentUser() user: JWTClaims,
    @Body() data: UpdateFirebasePushIdRequest,
  ): Promise<UpdateFirebasePushIdResponse> {
    return this.updateFirebaseIdCtx.execute({ userId: user.id, ...data });
  }
}
