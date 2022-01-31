import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountsManagementReadService } from './accounts-management.read-service';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { SkipAuth } from './auth/decorators/skip-auth.decorator';
import { JWTClaim } from './auth/login-payload.type';

@ApiBearerAuth()
@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readService: AccountsManagementReadService) {}

  @Get('/with-username/:username')
  async getAccountByUsername(
    @Param('username') username: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    username = username[0] === '@' ? username.slice(1) : username;

    return await this.readService.getAccountByUsername(username, payload.id);
  }

  @Get('can-i-use-this-credential')
  @SkipAuth()
  async checkCredential(@Query('usernameOrEmail') usernameOrEmail: string) {
    if (!usernameOrEmail)
      throw new BadRequestException(
        'Username or email must be provided in the url query',
      );
    return !(await this.readService.usernameOrEmailExists(usernameOrEmail));
  }
}
