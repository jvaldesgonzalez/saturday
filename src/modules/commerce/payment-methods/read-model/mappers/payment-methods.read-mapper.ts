import {
  PaymentMethodsFromDbEntity,
  PaymentMethodsReadEntity,
} from '../entities/payment-methods.read-entity';

export namespace PaymentMethodReadMapper {
  export function toResponse(
    db: PaymentMethodsFromDbEntity,
  ): PaymentMethodsReadEntity {
    return {
      ...db,
      methods: db.methods.map((m) => {
        return {
          ...m,
          gateways: m.gateways.map((gw) => {
            return {
              code: gw.code,
              name: gw.name,
              allowed: true,
              reasons: [],
            };
          }),
        };
      }),
    };
  }

  function analizeConstraints(constraints: any): boolean {
    return true;
  }
}
