import { ApiResponseProperty } from '@nestjs/swagger';
import { EventDetails } from '../../events/presentation/event-details';

export class CollectionDetails {
  @ApiResponseProperty({ type: EventDetails })
  events: EventDetails;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
}
