import { Module } from '@nestjs/common';
import { SimilarityController } from './similarity/similarity.controller';
import { SimilarityReadService } from './similarity/similarity.read-service';

@Module({
  providers: [SimilarityReadService],
  controllers: [SimilarityController],
})
export class RecommenderModule {}
