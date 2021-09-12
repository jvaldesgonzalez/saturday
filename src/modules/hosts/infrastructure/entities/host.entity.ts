import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

class HostPlace {
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  locationId: string;
}

export class DescriptionFieldRaw {
  header: string;
  body: string;
  inline: boolean;
}

export class HostEntity extends PersistentEntity {
  businessName: string;
  phoneNumber: string;
  aditionalBusinessData: string;

  @Type(() => HostPlace)
  @IsOptional()
  place?: HostPlace;
}
