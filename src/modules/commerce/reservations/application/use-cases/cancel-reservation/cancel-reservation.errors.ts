import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { IIdentifier } from 'src/shared/domain/Identifier';

export namespace CancelReservationErrors {
  const context = 'CancelReservationErrors';

  export class ReservationNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(userId: IIdentifier) {
      super(false, {
        message: `Reservation ${userId} not found`,
        context,
      });
    }
  }
}
