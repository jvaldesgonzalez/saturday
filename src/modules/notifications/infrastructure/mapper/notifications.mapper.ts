import {UniqueEntityID} from "src/shared/domain/UniqueEntityID";
import {Notification, NotificationType} from "../../domain/notification.entity";
import {RecipientId} from "../../domain/recipientId.entity";
import {NotificationEntity} from "../entities/notification.entity";

export class NotificationsMapper {
	public static PersistentToDomain(p: NotificationEntity): Notification {
		return Notification.create({
			title: p.title,
			description: p.description,
			recipientId: RecipientId.create(p.recipientId).getValue(),
			type: p.type as NotificationType,
			createdAt: new Date(p.createdAt),
			updatedAt: new Date(p.updatedAt)
		}, new UniqueEntityID(p.id)).getValue()
	}

	public static DomainToPersistent(d: Notification): NotificationEntity {
		return {
			id: d._id.toString(),
			createdAt: d.createdAt.toISOString(),
			updatedAt: d.updatedAt.toISOString(),
			title: d.title,
			description: d.description,
			type: d.type as string,
			recipientId: d.recipientId._id.toString(),
		}
	}
}
