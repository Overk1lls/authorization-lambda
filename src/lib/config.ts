import appRootPath from 'app-root-path';
import { config as loadConfig } from 'dotenv';

export interface Config {
  port: number;
  mongoDbUrl: string;
  jwtAccessTokenKey: string;
}

export const isNotProduction = () => {
  return !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
};

const envConfig = loadConfig({
  path: appRootPath.resolve('.env'),
  debug: isNotProduction(),
});

const loadError = envConfig.error as NodeJS.ErrnoException;
if (loadError) {
  if (loadError.code === 'ENOENT' || loadError.code === 'EACCES') {
    console.info(`Failed to load config from file "${loadError.path}": ${loadError.code}`);
  } else {
    console.warn('Unknown config file loading errors', loadError);
  }
}

const getConfig = (): Config => {
  let key = 'PORT';
  const port = Number.parseInt(process.env[key] ?? '8080');
  if (!port) {
    throw new Error(`The environment variable '${key}' is missing!`);
  }

  key = 'MONGO_URL';
  const mongoDbUrl = process.env[key];
  if (!mongoDbUrl) {
    throw new Error(`The environment variable '${mongoDbUrl}' is missing!`);
  }

  key = 'JWT_ACCESS_TOKEN_KEY';
  const jwtAccessTokenKey = process.env[key];
  if (!jwtAccessTokenKey) {
    throw new Error(`The environment variable '${jwtAccessTokenKey}' is missing!`);
  }

  return {
    port,
    mongoDbUrl,
    jwtAccessTokenKey,
  };
};

export const config: Config = getConfig();
