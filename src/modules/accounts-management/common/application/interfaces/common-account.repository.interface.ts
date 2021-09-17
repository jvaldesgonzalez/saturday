import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { CommonAccount } from '../../domain/common-account.domain';

export interface ICommonAccountRepository extends IRepository<CommonAccount> {
  usernameExists(theUsername: string): Promise<boolean>;
}
