import { AggregateDomainEntity } from 'src/shared/domain/aggregate-entity.abstract';

export type CommonAccountProps = {
  username: string;
  email: string;
  firebasePushId: string;
  appVersion: number;
  isActive: boolean;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
};

export class CommonAccount<
  T extends CommonAccountProps = CommonAccountProps,
> extends AggregateDomainEntity<T> {
  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get firebasePushId(): string {
    return this.props.firebasePushId;
  }

  get appVersion(): number {
    return this.props.appVersion;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get avatar(): string {
    return this.props.avatar;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }
}
