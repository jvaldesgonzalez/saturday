import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';
import {
  PaymentMethodsFromDbEntity,
  PaymentMethodsReadEntity,
} from './read-model/entities/payment-methods.read-entity';
import { PaymentMethodReadMapper } from './read-model/mappers/payment-methods.read-mapper';

@Injectable()
export class PaymentMethodsReadService {
  constructor(
    @InjectPersistenceManager() private persistenceManager: PersistenceManager,
  ) {}

  async getPaymentMethods(
    theTicketId: string,
  ): Promise<PaymentMethodsReadEntity> {
    const paymentMethods = await this.persistenceManager.query<
      PaymentMethodsFromDbEntity['methods'][number]
    >(
      QuerySpecification.withStatement(
        `
				MATCH (t:Ticket)
				WHERE t.id = $tId
				OPTIONAL MATCH (t)-[:ALLOW]-(pm:PaymentMethod)-[:IS_GATEWAY_FOR]-(pw:PaymentGateway)
				RETURN {
					code:pm.code,
					name:pm.name,
					description:pm.description,
					gateways:collect(distinct pw{.code, .name, .constraints, .logo})
				}
				`,
      )
        .bind({ tId: theTicketId })
        .map((r) => {
          console.log(r);
          return r;
        }),
    );
    return PaymentMethodReadMapper.toResponse({
      ticketId: theTicketId,
      methods: paymentMethods,
    });
  }
}
