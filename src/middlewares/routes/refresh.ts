import { JwtPayload } from 'jsonwebtoken';
import { getJwtPayload, getJwtFromRequest, generateAccessToken } from '../../lib/auth';
import { ExpressRouteFunc } from '../type';

export function refreshRoute(): ExpressRouteFunc {
  return async (req, res, next) => {
    try {
      const jwtPayload = getJwtPayload(getJwtFromRequest(req)) as JwtPayload;
      const newJwt = generateAccessToken(jwtPayload.sub);

      res.status(201).json({ token: newJwt });
    } catch (error) {
      next(error);
    }
  };
}
