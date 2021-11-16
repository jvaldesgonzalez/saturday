import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { BaseNotification } from '../../domain/notification.domain';

export interface INotificationsRepository
  extends IRepository<BaseNotification> {}
