import { CommonAccountMappers } from 'src/modules/accounts-management/common/infrastructure/mappers/common-account.mapper';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { TextUtils } from 'src/shared/utils/text.utils';
import { Partner } from '../../domain/partner.domain';
import { PartnerDescription } from '../../domain/value-objects/partner-description.value';
import { PartnerEntity } from '../entities/partner.entity';

export namespace PartnerMapper {
  export function fromPersistence(db: PartnerEntity): Partner {
    console.log({ db });
    return Partner.create(
      {
        ...db,
        aditionalBusinessData: TextUtils.escapeAndParse(
          db.aditionalBusinessData,
        ) as PartnerDescription,
        place: db.place,
        createdAt: parseDate(db.createdAt),
        updatedAt: parseDate(db.updatedAt),
        password: { value: db.password, isHashed: true },
        isVerified: db.isVerified,
      },
      new UniqueEntityID(db.id),
    ).getValue();
  }

  export function toPersistence(d: Partner): PartnerEntity {
    const common = CommonAccountMappers.toPersistence(d);
    return {
      ...common,
      aditionalBusinessData: JSON.stringify(d.aditionalBusinessData),
      businessName: d.businessName,
      phoneNumber: d.phoneNumber,
      password: d.password,
      place: d.place ? d.place : null,
      isVerified: d.isVerified,
    };
  }
}
