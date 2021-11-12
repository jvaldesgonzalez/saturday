import { IUseCaseError } from 'src/shared/core/interfaces/IUseCaseError';
import { Result } from 'src/shared/core/Result';
import { IIdentifier } from 'src/shared/domain/Identifier';

export namespace CreateReservationErrors {
  const context = 'CreateReservationErrors';

  export class TicketNotFound extends Result<IUseCaseError> {
    readonly message: string;
    constructor(userId: IIdentifier) {
      super(false, {
        message: `Ticket ${userId} not found`,
        context,
      });
    }
  }

  export class NotAvailableAmount extends Result<IUseCaseError> {
    readonly message: string;
    constructor(theTicketId: IIdentifier, amount: number) {
      super(false, {
        message: `Ticket ${theTicketId} have an amount less than ${amount}`,
        context,
      });
    }
  }
}
