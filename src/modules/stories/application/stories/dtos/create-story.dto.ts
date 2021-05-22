import { MultimediaRaw } from '../../events/dtos/create-event.dto';

export type CreateStoryDto = {
  publisher: string;
  multimedia: MultimediaRaw;
};
