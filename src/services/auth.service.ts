import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';
import { getJwtPayload, getJwtFromRequest } from '../lib/auth';
import { UsersRepository } from '../repositories/users.repository';

export class AuthService {
  constructor(private users: UsersRepository) {
    this.users = users;
  }

  async getUserFromRequestByJwt(req: Request) {
    return this.getUserFromJwt(getJwtFromRequest(req));
  }

  async getUserFromJwt(jwt: string) {
    return this.getUserFromPayload(getJwtPayload(jwt));
  }

  async getUserFromPayload(payload: string | JwtPayload) {
    const id = typeof payload === 'string' ? payload : payload.sub;
    const user = await this.users.findUserById(id);
    if (!user) {
      throw new LogicError(ErrorCode.AuthBad);
    }
    return user;
  }
}
