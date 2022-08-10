import { ErrorRequestHandler } from 'express';
import { ErrorCode } from '../../errors/codes';
import { LogicError } from '../../errors/logic.error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const sendResponse = (statusCode: number) => {
    res.status(statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  };

  if (err instanceof LogicError) {
    switch (err.code) {
      case ErrorCode.UserNotFound:
        sendResponse(404);
        break;

      case ErrorCode.AuthBad:
      case ErrorCode.AuthBadTokenScheme:
        sendResponse(401);
        break;

      case ErrorCode.AuthExpired:
        sendResponse(403);
        break;

      default:
        sendResponse(400);
        break;
    }
  } else {
    res.status(500).json({ error: 'Something went wrong...' });
  }
  if (Math.floor(res.statusCode / 100) === 5) {
    console.error(`Something went wrong: ${err}`);
  } else {
    console.debug(`Request error at '${req.url}': ${err}`);
  }
};
