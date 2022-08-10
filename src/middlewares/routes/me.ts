import { ErrorCode } from '../../errors/codes';
import { LogicError } from '../../errors/logic.error';
import { AuthService } from '../../services/auth.service';
import { ExpressRouteFunc } from '../type';

export function meRoute(auth: AuthService): ExpressRouteFunc {
  return async (req, res, next) => {
    try {
      const { num } = req.params;
      if (isNaN(parseInt(num))) {
        throw new LogicError(ErrorCode.BadParams, `The number in parameters is missing!`);
      }
      const user = await auth.getUserFromRequestByJwt(req);

      res.status(200).json({ num, user });
    } catch (error) {
      next(error);
    }
  };
}
