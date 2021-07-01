import { IEmail } from '../interfaces/IEmail';
import { IMailer } from '../interfaces/IMailer';

export class NodemailerMailer implements IMailer {
  send(_recipient: string, _email: IEmail): Promise<void> {
    return;
  }
  sendBulk(_recipients: string[], _email: IEmail): Promise<void> {
    return;
  }
}
