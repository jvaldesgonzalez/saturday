import { Controller, Get } from '@nestjs/common';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { CreateUserUseCase } from '../application/use-cases/create-user.usecase';

@Controller()
export class UsersController {
  constructor(private uc: CreateUserUseCase) {}
  @Get('/')
  public async test(): Promise<any> {
    return await this.uc.execute({
      fullname: 'adssdasd',
      username: 'dasdasdasd',
      profileImageUrl: 'dasdasdasdas',
      email: 'aere@gmail.com',
      firebasePushId: 'dasdadas',
      appVersion: 1,
      password: '21@fsdlk23ddas@WDEas',
      provider: 'local',
      role: EnumRoles.Partner,
    });
  }
}
