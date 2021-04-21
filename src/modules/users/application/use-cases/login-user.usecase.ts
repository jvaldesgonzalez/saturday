// import { Inject } from '@nestjs/common';
// import { Logger } from '@nestjs/common';
// import { Either, left, right } from 'src/shared/core/Either';
// import { AppError } from 'src/shared/core/errors/AppError';
// import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
// import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
// import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
// import { Result } from 'src/shared/core/Result';
// import { User } from '../../domain/entities/user.entity';
// import { UserErrors } from '../../domain/errors/user.errors';
// import { JWTToken } from '../../domain/value-objects/token.value';
// import { UserEmail } from '../../domain/value-objects/user-email.value';
// import { Username } from '../../domain/value-objects/username.value';
// import { IUserRepository } from '../../infrastructure/repositories/interface/user.repository.interface';
// import { LoginUserDto } from '../dtos/login-user.dto';

// export type LoginUserResponse = {
//   user: User;
//   token: JWTToken;
// };

// export type LoginUserUseCaseResponse = Either<
//   | UserErrors.UserWithEmailOrUsernameDoesNotExist
//   | UserErrors.WrongPassword
//   | AppError.UnexpectedError
//   | Result<any>,
//   Result<LoginUserResponse>
// >;

// export class LoginUserUseCase
//   implements IUseCase<LoginUserDto, LoginUserUseCaseResponse> {
//   private _logger: Logger;
//   constructor(
//     @Inject('IUnitOfWorkFactory')
//     private readonly _unitOfWorkFact: IUnitOfWorkFactory,
//     @Inject('IRepositoryFactory')
//     private readonly _repositoryFact: IRepositoryFactory<User, IUserRepository>,
//   ) {
//     this._logger = new Logger('LoginUserUseCase');
//   }

//   async execute({
//     usernameOrEmail: rawUsernameOrEmail,
//     password: plainPassword,
//   }: LoginUserDto): Promise<LoginUserUseCaseResponse> {
//     this._logger.log('Executing...');
//     const emailOrError = UserEmail.create({ value: rawUsernameOrEmail });
//     const usernameOrError = Username.create({ value: rawUsernameOrEmail });

//     const emailOrUsername = emailOrError.isSuccess
//       ? emailOrError
//       : usernameOrError;
//     if (emailOrUsername.isFailure) {
//       return left(Result.fail<void>(emailOrUsername.error.toString()));
//     }
//     try {
//       const unitOfWork = this._unitOfWorkFact.build();
//       await unitOfWork.start();
//       const userRepo = unitOfWork.getRepository(this._repositoryFact);
//       return await unitOfWork.commit(() =>
//         this.work(emailOrUsername.getValue(), plainPassword, userRepo),
//       );
//     } catch (error) {
//       return left(new AppError.UnexpectedError());
//     }
//   }

//   async work(
//     emailOrUsername: UserEmail | Username,
//     plainPassword: string,
//     userRepo: IUserRepository,
//   ): Promise<LoginUserUseCaseResponse> {
//     const user = await userRepo.findOneByEmailOrUsername(emailOrUsername);
//     if (!!user) {
//       return left(
//         new UserErrors.UserWithEmailOrUsernameDoesNotExist(emailOrUsername),
//       );
//     }

//     const res: LoginUserResponse = {
//       token: user.getUserToken(),
//       user: user,
//     };

//     return right(Result.ok(res));
//   }
// }
