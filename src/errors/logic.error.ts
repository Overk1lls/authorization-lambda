import { ErrorCode } from './codes';

interface ILogicError {
  code: ErrorCode;
}

export class LogicError extends TypeError implements ILogicError {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}
