import { CreateStoryUseCase } from './createStory/create-story.usecase';
import { DeleteStoryUseCase } from './deleteStory/delete-story.usecase';

const storiesUseCases = [CreateStoryUseCase, DeleteStoryUseCase];

export default storiesUseCases;
