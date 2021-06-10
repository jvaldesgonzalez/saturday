export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: T | string;
  private _value: T;

  public constructor(isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead.",
      );
    }

    return this._value;
  }

  public errorValue(): T {
    return this.error as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }

  public static combineOr(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isSuccess) return result;
    }
    return results[0];
  }
}

export function Ok<U>(value?: U): Result<U> {
  return new Result<U>(true, null, value);
}

export function Fail<U>(error: string): Result<U> {
  return new Result<U>(false, error);
}

export function Join<U>(results: Result<U>[]): Result<U[]> {
  const values: U[] = [];
  for (const result of results) {
    if (result.isFailure) return Fail(result.error.toString());
    values.push(result.getValue());
  }
  return Ok(values);
}
