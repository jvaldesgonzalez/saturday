import { Result } from '../Result';
import { UseCaseError } from '../UseCaseError';

/**
 * @desc General application errors (few of these as possible)
 * @http 500
 */
export namespace AppError {
  const _context = 'AppError';
  export class UnexpectedError extends Result<UseCaseError> {
    private readonly _brand?: UnexpectedError;
    public constructor() {
      super(false, {
        message: `An unexpected error occurred.`,
        context: _context,
      } as UseCaseError);
    }
  }

  export class ValidationError extends Result<UseCaseError> {
    private readonly _brand?: ValidationError;
    public constructor(message: string) {
      super(false, { message, context: _context } as UseCaseError);
    }
  }
}
