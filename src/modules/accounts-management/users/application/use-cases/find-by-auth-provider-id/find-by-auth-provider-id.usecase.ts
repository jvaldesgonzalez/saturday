// import { Inject, Logger } from '@nestjs/common';
// import { Either, left, right } from 'src/shared/core/Either';
// import { AppError } from 'src/shared/core/errors/AppError';
// import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
// import { Ok, Result } from 'src/shared/core/Result';
// import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
// import { User } from '../../../domain/user.domain';
// import { FindByAuthProviderIdDto } from '../../dtos/find-by-auth-provider-id.dto';
// import { IUserRepository } from '../../interfaces/user.repository.interface';
// import { UserProviders } from '../../../providers/providers.enum';
// import { FindByAuthProviderIdErrors } from './find-by-auth-provider-id.errors';

// type Response = Either<
//   AppError.UnexpectedError | FindByAuthProviderIdErrors.UserNotFound,
//   Result<User>
// >;

// export class FindByAuthProviderId
//   implements IUseCase<FindByAuthProviderIdDto, Response>
// {
//   private logger: Logger;

//   constructor(
//     @Inject(UserProviders.IUserRepository) private repo: IUserRepository,
//   ) {
//     this.logger = new Logger('FindByAuthProviderIdUseCase');
//   }

//   async execute(request: FindByAuthProviderIdDto): Promise<Response> {
//     this.logger.log('Executing');
//     try {
//       const authProviderId = new UniqueEntityID(request.authProviderId);

//       const userOrNone = await this.repo.findByEmail(authProviderId);

//       if (!userOrNone)
//         return left(
//           new FindByAuthProviderIdErrors.UserNotFound(authProviderId),
//         );

//       return right(Ok(userOrNone));
//     } catch (error) {
//       this.logger.error(error);
//       return left(new AppError.UnexpectedError());
//     }
//   }
// }
