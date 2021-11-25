import { DeleteStory } from './deleteStory/delete-story.usecase';
import { CreateStory } from './publishStory/publish-story.usecase';

const storiesUseCases = [DeleteStory, CreateStory];

export default storiesUseCases;
