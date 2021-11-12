export type CreateReservationDto = {
  ticketId: string;
  couponId?: string;
  amountOfTickets: number;
  issuerId: string;
};
