import {
  PaymentMethodsFromDbEntity,
  PaymentMethodsReadEntity,
} from '../entities/payment-methods.read-entity';

export namespace PaymentMethodReadMapper {
  export function toResponse(
    db: PaymentMethodsFromDbEntity,
  ): PaymentMethodsReadEntity {
    return {
      ticketId: db.ticketId,
      gateways: db.methods
        .flatMap((m) => {
          return m.gateways.map((gw) => {
            return {
              code: gw.code,
              name: gw.name,
              logo: gw.logo,
              allowed: true,
              reasons: [],
              methodCode: m.code,
            };
          });
        })
        .sort((a, _) => Number(a.methodCode == 'online_payment')),
    };
  }

  function analizeConstraints(constraints: any): boolean {
    return true;
  }
}
