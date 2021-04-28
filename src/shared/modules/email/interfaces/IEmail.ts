export type EmailSubject = string;
export type EmailBody = string;

export interface IEmail {
  subject: EmailSubject;
  body: EmailBody;
}
