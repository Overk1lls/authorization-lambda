import { config } from '../lib/config';
import { UsersRepository } from '../repositories/users.repository';
import { AuthService } from '../services/auth.service';
import { MongodbConnectionService } from '../services/mongodb-connection.service';

export interface Dependencies {
  users: UsersRepository;
  auth: AuthService;
}

export class DI {
  static async createDependencies(): Promise<Dependencies> {
    const { mongoDbUrl } = config;

    const mongodbConnectionService = new MongodbConnectionService(mongoDbUrl);
    await mongodbConnectionService.init();

    const users = new UsersRepository(mongodbConnectionService);
    await users.init();

    const authService = new AuthService(users);

    return { users, auth: authService };
  }
}
