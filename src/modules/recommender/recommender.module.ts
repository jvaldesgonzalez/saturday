import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { SimilarityController } from './similarity/similarity.controller';
import { SimilarityReadService } from './similarity/similarity.read-service';

@Module({
  providers: [SimilarityReadService, ScoringService],
  controllers: [SimilarityController],
  exports: [ScoringService],
})
export class RecommenderModule {}
