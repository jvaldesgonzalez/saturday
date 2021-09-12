import { DateTime } from 'neo4j-driver';
import { PersistentEntity } from 'src/shared/modules/data-access/neo4j/base.entity';

export class UserEntity extends PersistentEntity {
  fullname: string;
  birthdate: DateTime<number>;
  gender: 'male' | 'female' | 'non-binary';

  categoryPreferences: string[];
  locationId: string;

  //a unique identifier of the provider,
  //THE PROCESS :
  //the app sends a token that the provider
  //understands, then I access to the user info
  //by the provider API. In the info i would catch
  //a unique ID, then in login process I will verify
  //that the token sended by app contains the user
  //that has the providerUid in database
  authProviderUid: string;
  authProvider: 'facebook' | 'google';
}
