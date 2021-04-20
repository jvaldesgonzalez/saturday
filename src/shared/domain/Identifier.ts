export interface IIdentifier {
  equals<T extends IIdentifier>(id?: T): boolean;
  toString(): string;
}

export abstract class BaseIdentifier<T> {
  constructor(private readonly value: T) {
    this.value = value;
  }

  equals(id?: IIdentifier): boolean {
    if (id === null || id === undefined) return false;
    if (!(id instanceof this.constructor)) return false;
    return id.toString() === this.toString();
  }

  toString(): string {
    return String(this.value);
  }

  /**
   * Return raw value of identifier
   */
  toValue(): T {
    return this.value;
  }
}
