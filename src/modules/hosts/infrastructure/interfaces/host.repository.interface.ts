import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { Host } from '../../domain/entities/host.entity';

export interface IHostRepository extends IRepository<Host> {
  // registerBusiness(host: Host): Promise<void>;
  getUserIdAndTimestamp(
    userId: string,
  ): Promise<{ userId: string; createdAt: Date; updatedAt: Date }>;
}
