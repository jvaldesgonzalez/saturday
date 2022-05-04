import {
  InjectPersistenceManager,
  PersistenceManager,
  QuerySpecification,
} from '@liberation-data/drivine';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScoringService {
  constructor(
    @InjectPersistenceManager()
    private persistenceManager: PersistenceManager,
  ) {}

  async updateScore(
    theEventId: string,
    updateFunction: (_: number) => number,
  ): Promise<void> {
    const prevScore =
      (await this.persistenceManager.getOne<number>(
        QuerySpecification.withStatement(
          `
					MATCH (e:Event)
					WHERE e.id = $eId
					RETURN e.score 
			`,
        ).bind({ eId: theEventId }),
      )) || 0;

    console.log({ prevScore });
    console.log({ updatedScore: updateFunction(prevScore) });

    await this.persistenceManager.execute(
      QuerySpecification.withStatement(
        `
					MATCH (e:Event)
					WHERE e.id = $eId
					SET e.score = $newScore
			`,
      ).bind({ eId: theEventId, newScore: updateFunction(prevScore) }),
    );
  }
}
