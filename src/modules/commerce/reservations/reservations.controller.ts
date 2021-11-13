import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/accounts-management/auth/decorators/current-user.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { CancelReservationErrors } from './application/use-cases/cancel-reservation/cancel-reservation.errors';
import { CancelReservation } from './application/use-cases/cancel-reservation/cancel-reservation.usecase';
import { CreateReservationErrors } from './application/use-cases/create-reservation/create-reservation.errors';
import { CreateReservation } from './application/use-cases/create-reservation/create-reservation.usecase';
import { CreateReservationBody } from './presentation/create-payment';
import { ReservationReadResponse } from './presentation/reservation-read';
import { ReservationsReadService } from './reservations.read-service';

@ApiBearerAuth()
@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readService: ReservationsReadService,
    private createReservationUC: CreateReservation,
    private cancelReservationUC: CancelReservation,
  ) {}

  @Get()
  @ApiOkResponse({ type: [ReservationReadResponse] })
  @ApiQuery({ name: 'skip', type: Number })
  @ApiQuery({ name: 'take', type: Number })
  async getMyReservations(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('take', ParseIntPipe) limit: number,
    @CurrentUser() payload: JWTClaim,
  ) {
    return await this.readService.getMyReservations(payload.id, skip, limit);
  }

  @Get('/:id')
  @ApiOkResponse({ type: ReservationReadResponse })
  async getReservationById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    const reservation = await this.readService.getReservationDetails(
      payload.id,
      id,
    );
    if (!reservation)
      throw new NotFoundException('reservation not found on this user');
    return reservation;
  }

  @Post('')
  async createReservation(
    @Body() data: CreateReservationBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.createReservationUC.execute({
      ...data,
      issuerId: payload.id,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreateReservationErrors.TicketNotFound:
          throw new ConflictException(error.errorValue().message);
        case CreateReservationErrors.NotAvailableAmount:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }

  @Post('/:id/cancel')
  @ApiParam({ name: 'id', type: String })
  async cancelReservation(
    @Param('id', ParseUUIDPipe) reservationId: string,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.cancelReservationUC.execute({
      reservationId,
      userId: payload.id,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CancelReservationErrors.ReservationNotFound:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
