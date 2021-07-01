import {
  Controller,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JWTClaims } from 'src/modules/users/domain/value-objects/token.value';
import { CurrentUser } from 'src/shared/core/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/shared/core/auth/JwtAuth.guard';
import { AddEventToCollectionController } from './controllers/addEventToCollection/add-event-to-collection.controller';
import { AddEventToCollectionBody } from './controllers/addEventToCollection/request';
import { AddEventToCollectionResponse } from './controllers/addEventToCollection/response';

import { CreateCollectionController } from './controllers/createCollection/create-collection.controller';
import { CreateCollectionBody } from './controllers/createCollection/request';
import { CreateCollectionResponse } from './controllers/createCollection/response';
import { DeleteCollectionController } from './controllers/deleteCollection/delete-collection.controller';
import { DeleteCollectionResponse } from './controllers/deleteCollection/response';

import { EditTicketResponse } from './controllers/editTicket/response';
import { RemoveEventFromCollectionController } from './controllers/removeEventFromCollection/remove-event-from-collection.controller';
import { RemoveEventFromCollectionResponse } from './controllers/removeEventFromCollection/response';
import { UpdateCollectionBody } from './controllers/updateCollection/request';
import { UpdateCollectionResponse } from './controllers/updateCollection/response';
import { UpdateCollectionController } from './controllers/updateCollection/update-collection.controller';

@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsRouter {
  constructor(
    private createCollectionCtx: CreateCollectionController,
    private updateCollectionCtx: UpdateCollectionController,
    private addEventToCollectionCtx: AddEventToCollectionController,
    private deleteCollectionCtx: DeleteCollectionController,
    private removeEventFromCollectionCtx: RemoveEventFromCollectionController,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  @ApiResponse({ status: 200, type: [CreateCollectionResponse] })
  async createCollection(
    @CurrentUser() user: JWTClaims,
    @Body() data: CreateCollectionBody,
  ): Promise<EditTicketResponse> {
    return this.createCollectionCtx.execute({
      publisher: user.id,
      ...data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [DeleteCollectionResponse] })
  async deleteCollection(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
  ): Promise<DeleteCollectionResponse> {
    return this.deleteCollectionCtx.execute({
      publisher: user.id,
      collectionId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [UpdateCollectionResponse] })
  async updateCollection(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
    @Body() data: UpdateCollectionBody,
  ): Promise<UpdateCollectionResponse> {
    return this.updateCollectionCtx.execute({
      publisher: user.id,
      collectionId: id,
      ...data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/events')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [AddEventToCollectionResponse] })
  async addEventToCollection(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
    @Body() data: AddEventToCollectionBody,
  ): Promise<UpdateCollectionResponse> {
    return this.addEventToCollectionCtx.execute({
      publisher: user.id,
      collectionId: id,
      ...data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id/events/:eventId')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: [RemoveEventFromCollectionResponse] })
  async removeEventFromCollection(
    @CurrentUser() user: JWTClaims,
    @Param('id') id: string,
    @Param('eventId') eventId: string,
  ): Promise<RemoveEventFromCollectionResponse> {
    return this.removeEventFromCollectionCtx.execute({
      publisher: user.id,
      collectionId: id,
      eventId,
    });
  }
}
