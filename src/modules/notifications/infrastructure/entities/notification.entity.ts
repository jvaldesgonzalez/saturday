import {PersistentEntity} from "src/shared/modules/data-access/neo4j/base.entity";

export class NotificationEntity extends PersistentEntity {
	title: string;
	description: string;
	type: string;
	recipientId:string;
}
