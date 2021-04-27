import { Controller, Get } from '@nestjs/common';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { CreateUserLocalUseCase } from '../application/use-cases/create-user-local.usecase';
// import { LoginUserUseCase } from '../application/use-cases/login-user.usecase';

@Controller()
export class UsersController {
  constructor(private uc: CreateUserLocalUseCase) {}
  @Get('/')
  public async test(): Promise<any> {
    return await this.uc.execute({
      fullname: 'adssdasd',
      username: 'owierowiur',
      profileImageUrl: 'dasdasdasdas',
      email: 'aerdlfkj@gmail.com',
      firebasePushId: 'dasdadas',
      appVersion: 1,
      password: '21@fsdlk@U23dda',
      role: EnumRoles.Partner,
    });
    // return await this.uc.execute({
    //   usernameOrEmail: 'aergmail.com',
    //   password: 'asdasd',
    // });
  }
}
