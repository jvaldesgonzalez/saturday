import { MultimediaType } from 'src/shared/domain/multimedia.value';

type MultimediaRaw = {
  type: MultimediaType;
  url: string;
};
export type CreateStoryDto = {
  publisher: string;
  multimedia: MultimediaRaw;
};
