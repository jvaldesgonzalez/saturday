import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
  Transactional,
} from '@liberation-data/drivine';
import { IIdentifier } from 'src/shared/domain/Identifier';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { BaseRepository } from 'src/shared/modules/data-access/neo4j/base.repository';
import { IPartnerRepository } from '../../application/interfaces/partner.repository.interface';
import { Partner } from '../../domain/partner.domain';
import { PartnerEntity } from '../entities/partner.entity';
import { PartnerMapper } from '../mappers/partner.mapper';

export class PartnerRepository
  extends BaseRepository<Partner, PartnerEntity>
  implements IPartnerRepository
{
  constructor(
    @InjectPersistenceManager() persistenceManager: PersistenceManager,
  ) {
    super(
      'Partner',
      PartnerMapper.toPersistence,
      'PartnerRepository',
      persistenceManager,
    );
  }

  async findByUsernameOrEmail(theUsernameOrEmail: string): Promise<Partner> {
    const persistence =
      await this.persistenceManager.maybeGetOne<PartnerEntity>(
        QuerySpecification.withStatement(
          `MATCH (p:Partner)
					WHERE p.username = $pCred OR p.email = $pCred
					OPTIONAL MATCH (p)--(place:Place)--(l:Location)
					RETURN p{
						.id,
						.username, 
						.email, 
						.firebasePushId, 
						.appVersion, 
						.isActive,
						.avatar,
						.refreshToken,
						.createdAt,
						.updatedAt,
						.phoneNumber,
						.aditionalBusinessData,
						.businessName,
						.password,
						place: place{.name, .address, .longitude, .latitude, locationId:l.id}
					}
				`,
        )
          .bind({ pCred: theUsernameOrEmail })
          .transform(PartnerEntity),
      );
    return persistence ? PartnerMapper.fromPersistence(persistence) : null;
  }

  async findById(theId: UniqueEntityID): Promise<Partner> {
    const persistence =
      await this.persistenceManager.maybeGetOne<PartnerEntity>(
        QuerySpecification.withStatement(
          `MATCH (p:Partner)
					WHERE p.id = $theId
					OPTIONAL MATCH (p)--(place:Place)--(l:Location)
					RETURN p{
						.id,
						.username, 
						.email, 
						.firebasePushId, 
						.appVersion, 
						.isActive,
						.avatar,
						.refreshToken,
						.createdAt,
						.updatedAt,
						.phoneNumber,
						.aditionalBusinessData,
						.businessName,
						.password,
						place: place{.name, .address, .longitude, .latitude, locationId:l.id}
					}
				`,
        )
          .bind({ theId: theId.toString() })
          .transform(PartnerEntity),
      );
    return persistence ? PartnerMapper.fromPersistence(persistence) : null;
  }

  async emailIsTaken(theEmail: string): Promise<boolean> {
    return (await this.persistenceManager.maybeGetOne<PartnerEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:Partner)
			WHERE u.email = $email
				RETURN u.id`,
      ).bind({ email: theEmail }),
    ))
      ? true
      : false;
  }

  async usernameIsTaken(theUsername: string): Promise<boolean> {
    return (await this.persistenceManager.maybeGetOne<PartnerEntity>(
      QuerySpecification.withStatement(
        `MATCH (u:Partner)
				WHERE u.username = $username
				RETURN u.id`,
      ).bind({ username: theUsername }),
    ))
      ? true
      : false;
  }

  @Transactional()
  async save(thePartner: Partner): Promise<void> {
    const persistent = PartnerMapper.toPersistence(thePartner);
    const { place, ...data } = persistent;
    console.log(place);
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MERGE (u:Partner {id:$uId})
				SET u:Account
				SET u += $data`,
      ).bind({
        uId: persistent.id,
        data,
      }),
    );
    if (place) await this.addPlace(thePartner._id, thePartner.place);
  }

  private async addPlace(
    thePartnerId: IIdentifier,
    thePlace: Partner['place'],
  ): Promise<void> {
    console.log('hay place');
    const { locationId, ...placeData } = thePlace;
    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `MATCH (p:Partner),(l:Location)
				WHERE p.id = $uId
				AND l.id = $lId
				MERGE (p)-[:HAS_PLACE]->(place:Place)-[:IN_LOCATION]->(l)
				SET place += $placeData`,
      ).bind({ uId: thePartnerId.toString(), placeData, lId: locationId }),
    );
  }
}
