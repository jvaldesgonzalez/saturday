import { AddEventUseCase } from './addEvent/add-event.usecase';
import { CreateCollectionUseCase } from './createCollection/create-collection.usecase';
import { DeleteCollectionUseCase } from './deleteCollection/delete-collection.usecase';
import { RemoveEventUseCase } from './removeEvent/remove-event.usecase';
import { UpdateCollectionUseCase } from './updateCollection/update-collection.usecase';

const collectionsUseCases = [
  AddEventUseCase,
  CreateCollectionUseCase,
  DeleteCollectionUseCase,
  RemoveEventUseCase,
  UpdateCollectionUseCase,
];

export default collectionsUseCases;
