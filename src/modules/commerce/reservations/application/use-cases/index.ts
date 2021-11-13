import { CancelReservation } from './cancel-reservation/cancel-reservation.usecase';
import { CreateReservation } from './create-reservation/create-reservation.usecase';

const reservationUseCases = [CreateReservation, CancelReservation];

export default reservationUseCases;
