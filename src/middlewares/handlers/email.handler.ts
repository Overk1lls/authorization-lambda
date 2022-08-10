import { RequestHandler } from 'express';
import { ErrorCode } from '../../errors/codes';
import { LogicError } from '../../errors/logic.error';
import { regexes } from '../../lib/regex';

export const bodyEmailCheckHandler: RequestHandler = (req, res, next) => {
  const { email } = req.body;
  if (!regexes.email.test(email)) {
    next(new LogicError(ErrorCode.UserEmailNotAppropriate, 'Please, enter a valid email!'));
  }
  next();
};
