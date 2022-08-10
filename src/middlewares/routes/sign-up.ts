import { UserLogin } from '../../interfaces/user';
import { UsersRepository } from '../../repositories/users.repository';
import { ExpressRouteFunc } from '../type';

export function signUpRoute(users: UsersRepository): ExpressRouteFunc {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body as UserLogin;

      const newUser = await users.createUser({ email, password });

      res.status(201).json({ user: newUser });
    } catch (error) {
      next(error);
    }
  };
}
