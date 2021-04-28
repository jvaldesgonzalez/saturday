import { IEmail } from '../interfaces/IEmail';
import { IMailer } from '../interfaces/IMailer';

export class NodemailerMailer implements IMailer {
  send(recipient: string, email: IEmail): Promise<void> {
    return;
  }
  sendBulk(recipients: string[], email: IEmail): Promise<void> {
    return;
  }
}
