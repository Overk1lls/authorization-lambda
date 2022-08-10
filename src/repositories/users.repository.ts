import { compare, hash } from 'bcrypt';
import { omit } from 'lodash';
import { Collection, MongoServerError, ObjectId, WithId } from 'mongodb';
import { ErrorCode } from '../errors/codes';
import { LogicError } from '../errors/logic.error';
import { UserDTO, UserLogin } from '../interfaces/user';
import { MongodbConnectionService } from '../services/mongodb-connection.service';

const usersCollectionName = 'users';

const toUserDTO = (document: UserLogin | WithId<UserLogin>): UserDTO => {
  const user = omit(document, '_id', 'password') as UserDTO;
  if ('_id' in document) {
    user.id = document._id.toHexString();
  }
  return user;
};

export class UsersRepository {
  private readonly collection: Collection<UserLogin>;

  constructor(private dbConnection: MongodbConnectionService) {
    this.collection = dbConnection.client
      .db(dbConnection.defaultDbName)
      .collection(usersCollectionName);
  }

  async init() {
    await this.collection.createIndex({ email: 1 }, { unique: true });
  }

  async createUser(user: UserLogin): Promise<UserDTO> {
    const { email } = user;
    const pwdHash = await hash(user.password, 10);

    try {
      const newUser = await this.collection.insertOne({
        email,
        password: pwdHash,
      });
      return {
        email,
        id: newUser.insertedId.toHexString(),
      };
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new LogicError(
          ErrorCode.UserEmailDuplicate,
          `User with that email '${email}' already exists!`
        );
      }
      throw error;
    }
  }

  async findUserByEmail(email: string, password?: string): Promise<UserDTO> {
    const userToFind = await this.collection.findOne({ email });
    if (!userToFind) {
      throw new LogicError(ErrorCode.UserNotFound, `User with that email '${email}' is not found!`);
    }
    if (password) {
      const isPwdOk = await compare(password, userToFind.password);
      if (!isPwdOk) {
        throw new LogicError(ErrorCode.UserBadCredentials, `Either email or password is wrong!`);
      }
    }
    return toUserDTO(userToFind);
  }

  async findUserById(id: string): Promise<UserDTO> {
    const userToFind = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!userToFind) {
      throw new LogicError(ErrorCode.UserNotFound, `User with that id '${id}' is not found!`);
    }
    return toUserDTO(userToFind);
  }
}
