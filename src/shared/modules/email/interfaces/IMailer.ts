import { IEmail } from './IEmail';

export type EmailAddress = string;

export interface IMailer {
  send(recipient: EmailAddress, email: IEmail): Promise<void>;
  sendBulk(recipients: EmailAddress[], email: IEmail): Promise<void>;
}
