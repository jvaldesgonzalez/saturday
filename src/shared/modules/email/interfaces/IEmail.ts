export type EmailSubject = string;
export type EmailBody = string;
export type EmailSender = string;

export interface IEmail {
	from: EmailSender;
	subject: EmailSubject;
	body: EmailBody;
}
