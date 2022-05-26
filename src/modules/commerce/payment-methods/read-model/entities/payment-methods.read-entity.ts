class PaymentGatewayFromDb {
  code: string;
  name: string;
  logo: string;
  constraints: string;
}

class PaymentMethodFromDb {
  name: string;
  description: string;
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
  logo: string;
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
