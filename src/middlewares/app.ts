import express from 'express';
import cors from 'cors';
import { defaultHandler } from './handlers/default';
import { signUpRoute } from './routes/sign-up';
import { Dependencies } from '../di/container';
import { errorHandler } from './handlers/error.handler';
import { bodyEmailCheckHandler } from './handlers/email.handler';
import { loginRoute } from './routes/login';
import { meRoute } from './routes/me';
import { refreshRoute } from './routes/refresh';

const apiPrefix = '/api/v1';

export const createApp = (deps: Dependencies) => {
  const app = express();
  const { users, auth } = deps;

  app.use(cors());
  app.use(express.json());

  app.use(defaultHandler);
  app.post(`${apiPrefix}/sign-up`, bodyEmailCheckHandler, signUpRoute(users));
  app.post(`${apiPrefix}/login`, bodyEmailCheckHandler, loginRoute(users));
  app.get(`${apiPrefix}/me/:num`, meRoute(auth));
  app.get(`${apiPrefix}/refresh`, refreshRoute());
  app.use(errorHandler);

  return app;
};
