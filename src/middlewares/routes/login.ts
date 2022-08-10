import { UserLogin } from '../../interfaces/user';
import { generateAccessToken } from '../../lib/auth';
import { UsersRepository } from '../../repositories/users.repository';
import { ExpressRouteFunc } from '../type';

export function loginRoute(users: UsersRepository): ExpressRouteFunc {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body as UserLogin;

      const user = await users.findUserByEmail(email, password);

      const jwt = generateAccessToken(user.id);

      res.status(200).json({ token: jwt });
    } catch (error) {
      next(error);
    }
  };
}
