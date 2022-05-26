class PaymentGatewayFromDb {
  code: string;
  name: string;
  constraints: string;
}

class PaymentMethodFromDb {
  code: string;
  gateways: PaymentGatewayFromDb[];
}

export class PaymentMethodsFromDbEntity {
  ticketId: string;
  methods: PaymentMethodFromDb[];
}

class PaymentGateway {
  code: string;
  name: string;
  allowed: boolean;
  reasons: string[];
}

class PaymentMethod {
  code: string;
  gateways: PaymentGateway[];
}

export class PaymentMethodsReadEntity {
  ticketId: string;
  methods: PaymentMethod[];
}
