import {
  Body,
  ConflictException,
  Controller,
  Get,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
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
import { Roles } from 'src/modules/accounts-management/auth/decorators/role.decorator';
import { JWTClaim } from 'src/modules/accounts-management/auth/login-payload.type';
import { EnumRoles } from 'src/shared/domain/roles.enum';
import { CancelReservationErrors } from './application/use-cases/cancel-reservation/cancel-reservation.errors';
import { CancelReservation } from './application/use-cases/cancel-reservation/cancel-reservation.usecase';
import { ConfirmReservationErrors } from './application/use-cases/confirm-reservation/confirm-reservation.errors';
import { ConfirmReservation } from './application/use-cases/confirm-reservation/confirm-reservation.usecase';
import { CreateReservationErrors } from './application/use-cases/create-reservation/create-reservation.errors';
import { CreateReservation } from './application/use-cases/create-reservation/create-reservation.usecase';
import { ConfirmReservationBody } from './presentation/confirm-reservation';
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
    private confirmReservationUC: ConfirmReservation,
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
          throw new NotFoundException(error.errorValue().message);
        case CreateReservationErrors.NotAvailableAmount:
          throw new ConflictException(error.errorValue().message);
        case CreateReservationErrors.CantReserveTwice:
          throw new ImATeapotException(error.errorValue().message);
        case CreateReservationErrors.MaxReservationsAttempt:
          throw new MethodNotAllowedException(error.errorValue().message);
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

  @Post('/confirm')
  @Roles(EnumRoles.Partner)
  async confirmReservation(
    @Body() data: ConfirmReservationBody,
    @CurrentUser() payload: JWTClaim,
  ) {
    const result = await this.confirmReservationUC.execute({
      ...data,
      validatorId: payload.id,
    });

    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case ConfirmReservationErrors.ReservationNotFound:
          throw new NotFoundException(error.errorValue().message);
        case ConfirmReservationErrors.ReservationIsVerified:
          throw new ConflictException({
            error: error.errorValue().message,
            data: error.errorValue().data,
          });
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else if (result.isRight()) {
      return result.value.getValue();
    }
  }
}
