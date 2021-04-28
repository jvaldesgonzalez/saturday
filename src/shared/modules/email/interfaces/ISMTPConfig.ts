export type SMTPService = 'gmail';

interface IBasicAuthService {
  user: string;
  pass: string;
}

export type SMTPAuth = IBasicAuthService;

export interface ISMTPConfig {
  service: SMTPService;
  auth: SMTPAuth;
}
