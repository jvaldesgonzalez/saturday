import { Module } from '@nestjs/common';
import { GeolocationController } from './geolocation.controller';
import { GeolocationReadService } from './geolocation.read-service';

@Module({
  providers: [GeolocationReadService],
  controllers: [GeolocationController],
})
export class GeolocationModule {}
