import { CreateStoryController } from './createStory/create-story.controller';
import { DeleteStoryController } from './deleteStory/create-story.controller';
import { GetStoriesFromHostController } from './getStoriesFromHost/get-host-stories.controller';

const storiesControllers = [
  GetStoriesFromHostController,
  CreateStoryController,
  DeleteStoryController,
];

export default storiesControllers;
