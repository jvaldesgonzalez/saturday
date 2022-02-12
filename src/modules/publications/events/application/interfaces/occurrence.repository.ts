import { IRepository } from 'src/shared/core/interfaces/IRepository';
import { EventOccurrence } from '../../domain/event-occurrence.domain';

export interface IOccurrenceRepository extends IRepository<EventOccurrence> {}
