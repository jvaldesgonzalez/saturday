import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Partner } from '../../domain/partner.domain';

export interface IPartnerRepository extends IRepository<Partner> {
  findById(id: UniqueEntityID): Promise<Partner>;
  emailIsTaken(theEmail: string): Promise<boolean>;
  usernameIsTaken(theUserame: string): Promise<boolean>;
  findByUsernameOrEmail(theUsernameOrEmail: string): Promise<Partner>;
}
