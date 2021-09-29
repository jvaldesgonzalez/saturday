import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { Notification } from '../../domain/notification.domain';

export interface INotificationsRepository extends IRepository<Notification> {}
