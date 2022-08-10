import { MongoClient } from 'mongodb';
import { URL } from 'url';

export class MongodbConnectionService {
  readonly client: MongoClient;
  readonly connectionUrl: URL;
  readonly defaultDbName: string;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
    this.connectionUrl = new URL(connectionString);
    this.defaultDbName = this.connectionUrl.pathname.slice(1);
  }

  async init() {
    return this.client
      .connect()
      .then(() => {
        return this.client.db().command({
          ping: 1,
        });
      })
      .then(() => {
        console.info(`MongoDB connected to the database: '${this.defaultDbName}'`);
      });
  }

  async dispose() {
    return this.client.close().then(() => console.info('MongoDB disconnected'));
  }
}
