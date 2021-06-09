import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { Host } from '../../domain/entities/host.entity';
import { GetHostProfileResponse } from '../../presentation/controllers/getProfile/response';

export interface IHostRepository extends IRepository<Host> {
  findById(id: string): Promise<Host>;
  getUserIdAndTimestamp(
    userId: string,
  ): Promise<{ userId: string; createdAt: Date; updatedAt: Date }>;

  //view repositorie
  getProfileByHostId(hostId: string): Promise<GetHostProfileResponse>;
}
