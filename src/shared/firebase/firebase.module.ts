import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    FirebaseModule.forRoot({
      //FIXME: Why I have to put the expanded path?
      //TODO: Change library or find another way with this one
      googleApplicationCredential:
        'src/shared/firebase/cert/firebase-service-account.json',
    }),
  ],
})
export class FirebaseAdminModule {}
