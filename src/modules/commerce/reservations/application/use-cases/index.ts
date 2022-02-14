import { CancelReservation } from './cancel-reservation/cancel-reservation.usecase';
import { ConfirmReservation } from './confirm-reservation/confirm-reservation.usecase';
import { CreateReservation } from './create-reservation/create-reservation.usecase';

const reservationUseCases = [
  CreateReservation,
  CancelReservation,
  ConfirmReservation,
];

export default reservationUseCases;
