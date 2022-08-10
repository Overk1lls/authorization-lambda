import { v4 as uuid } from 'uuid';
import { sign, TokenExpiredError, verify, VerifyErrors } from 'jsonwebtoken';
import { config } from './config';
import { Request } from 'express';
import { LogicError } from '../errors/logic.error';
import { ErrorCode } from '../errors/codes';
import { regexes } from './regex';
import { randomNum } from './utils';

const jwtAlgorithm = 'HS512';
const { jwtAccessTokenKey } = config;

export const generateAccessToken = (userId: string) => {
  const tokenId = uuid();

  const jwtAccessToken = sign({ jti: tokenId, sub: userId }, jwtAccessTokenKey, {
    algorithm: jwtAlgorithm,
    expiresIn: randomNum(30, 60).toString(),
  });

  return jwtAccessToken;
};

export const getJwtFromRequest = (req: Request) => {
  if (!req.headers.authorization) {
    throw new LogicError(ErrorCode.AuthBad);
  }
  return getJwtFromBearerTokenString(req.headers.authorization);
};

export const getJwtFromBearerTokenString = (str: string) => {
  if (!regexes.token.test(str)) {
    throw new LogicError(ErrorCode.AuthBadTokenScheme);
  }
  return str.replace(regexes.token, '');
};

export const handleJwtError = (err: VerifyErrors) => {
  if (err instanceof TokenExpiredError) {
    throw new LogicError(ErrorCode.AuthExpired);
  }
  throw new LogicError(ErrorCode.AuthBad);
};

export const getJwtPayload = (jwt: string) => {
  try {
    return verify(jwt, jwtAccessTokenKey, { algorithms: [jwtAlgorithm] });
  } catch (error) {
    handleJwtError(error);
  }
};
