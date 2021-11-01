import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { GeolocationReadService } from './geolocation.read-service';
import { GetNearEventsBody } from './presentation/get-near-events';

@ApiBearerAuth()
@ApiTags('geolocation')
@Controller('geolocation')
export class GeolocationController {
  constructor(private readService: GeolocationReadService) {}

  @Get('near-events')
  @ApiBody({ type: GetNearEventsBody })
  async getNearEvents(@Body() data: GetNearEventsBody) {
    return await this.readService.getNearEvents(
      data.location,
      data.distance,
      data.dateInterval,
      data.categories,
    );
  }
}
