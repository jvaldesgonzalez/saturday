import { DateTime } from 'neo4j-driver-core';
import { UniqueEntityID } from 'src/shared/domain/UniqueEntityID';
import { parseDate } from 'src/shared/modules/data-access/neo4j/utils';
import { Payment } from '../../domain/payment.domain';
import { PaymentGateway } from '../../domain/value-objects/payment-gateway.value';
import { PaymentStatus } from '../../domain/value-objects/payment-status';
import { PaymentEntity } from '../entities/payment.entity';

export namespace PaymentMappers {
  export function toPersistence(domain: Payment): PaymentEntity {
    return {
      id: domain._id.toString(),
      createdAt: DateTime.fromStandardDate(domain.createdAt),
      updatedAt: DateTime.fromStandardDate(domain.updatedAt),
      executedAt: domain.executedAt
        ? DateTime.fromStandardDate(domain.executedAt)
        : null,
      ticketId: domain.ticketId.toString(),
      couponId: domain.couponId ? domain.couponId.toString() : null,
      amountOfTickets: domain.amountOfTickets,
      gateway: domain.gateway,
      status: domain.status,
      issuerId: domain.issuerId,
      transactionUUID: domain.transactionUUID,
    };
  }

  export function fromPersistence(p: PaymentEntity): Payment {
    return Payment.create(
      {
        ...p,
        createdAt: parseDate(p.createdAt),
        updatedAt: parseDate(p.updatedAt),
        executedAt: parseDate(p.executedAt),
        couponId: p.couponId && new UniqueEntityID(p.couponId),
        ticketId: new UniqueEntityID(p.ticketId),
        gateway: p.gateway as PaymentGateway,
        status: p.status as PaymentStatus,
        issuerId: new UniqueEntityID(p.issuerId),
        transactionUUID: p.transactionUUID,
      },
      new UniqueEntityID(p.id),
    ).getValue();
  }
}
