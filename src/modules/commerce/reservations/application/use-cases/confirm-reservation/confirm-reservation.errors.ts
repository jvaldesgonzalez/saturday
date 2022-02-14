import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';

export namespace ConfirmReservationErrors {
  const context = 'ConfirmReservationErrors';

  export class ReservationNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(securityPhrase: string) {
      super(false, {
        message: `Reservation with phrase ${securityPhrase} not found`,
        context,
      });
    }
  }

  export class ReservationIsVerified extends Result<IUseCaseError> {
    readonly message: string;
    constructor() {
      super(false, {
        message: `Reservation has been verified`,
        context,
      });
    }
  }
}
