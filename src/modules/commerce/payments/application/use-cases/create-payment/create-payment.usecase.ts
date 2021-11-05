import { Inject, Logger } from '@nestjs/common';
import { Either, left, right } from 'src/shared/core/Either';
import { AppError } from 'src/shared/core/errors/AppError';
import { IRepositoryFactory } from 'src/shared/core/interfaces/IRepository';
import { IUnitOfWorkFactory } from 'src/shared/core/interfaces/IUnitOfWork';
import { IUseCase } from 'src/shared/core/interfaces/IUseCase';
import { Ok, Result } from 'src/shared/core/Result';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { Payment } from '../../../domain/payment.domain';
import { PaymentProviders } from '../../../providers/providers.enum';
import { CreatePaymentDto } from '../../dtos/create-payment.dto';
import { IPaymentService } from '../../interfaces/payment-service.interface';
import { IPaymentsRepository } from '../../interfaces/payments.repository.interface';
import { CreatePaymentErrors } from './create-payment.errors';

type Response = Either<
  | CreatePaymentErrors.TicketNotFound
  | CreatePaymentErrors.NotAvailableAmount
  | AppError.UnexpectedError,
  Result<{ redirectUrl: string }>
>;

export class CreatePayment implements IUseCase<CreatePaymentDto, Response> {
  private logger: Logger;

  // The UoW pattern is fully necessary because the transactional nature of the usecase
  // Ex: If we can't create the payment, then we can't take the availability
  constructor(
    @Inject(PaymentProviders.IPaymentRepositoryFactory)
    private repoFact: IRepositoryFactory<Payment, IPaymentsRepository>,
    @Inject(PaymentProviders.IPaymentUnitOfWorkFactory)
    private uowFact: IUnitOfWorkFactory,
    @Inject(PaymentProviders.IPaymentService) private service: IPaymentService,
  ) {
    this.logger = new Logger('CreatePaymentUseCase');
  }

  async execute(request: CreatePaymentDto): Promise<Response> {
    this.logger.log('Executing...');
    try {
      const uow = this.uowFact.build();
      await uow.start();
      const repo = uow.getRepository(this.repoFact);
      return uow.commit(() => this.work(request, repo));
    } catch (error) {
      return left(new AppError.UnexpectedError());
    }
  }

  private async work(
    request: CreatePaymentDto,
    repo: IPaymentsRepository,
  ): Promise<Response> {
    const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const ticketId = new UniqueEntityID(request.ticketId);
    const couponId = request.couponId && new UniqueEntityID(request.couponId);
    const issuerId = request.issuerId && new UniqueEntityID(request.issuerId);

    const couldFetchAvailability = await repo.fetchAvailability(
      ticketId,
      request.amountOfTickets,
    );
    if (!couldFetchAvailability)
      return left(
        new CreatePaymentErrors.NotAvailableAmount(
          ticketId,
          request.amountOfTickets,
        ),
      );

    const ticketDataOrNone = await repo.getTicketMetadata(ticketId);
    if (!ticketDataOrNone)
      return left(new CreatePaymentErrors.TicketNotFound(ticketId));

    const paymentOrError = Payment.new({
      ...request,
      ticketId,
      couponId,
      issuerId,
    });
    const payment = paymentOrError.getValue();

    console.log('apurate y apaga el vpn');
    await timer(5000);
    const { transactionUUID, redirectUrl } =
      await this.service.generatePaymentLink({
        ticketPrice: ticketDataOrNone.price,
        quantity: request.amountOfTickets,
        total: ticketDataOrNone.price * request.amountOfTickets,
        name: `${ticketDataOrNone.eventName} | ${ticketDataOrNone.name}`,
        description: ticketDataOrNone.description,
        discount: 0,
      });
    payment.setTransactionUUID(transactionUUID);

    console.log('apurate y enciende el vpn');
    await timer(5000);
    await repo.save(paymentOrError.getValue());

    return right(Ok({ redirectUrl }));
  }
}
