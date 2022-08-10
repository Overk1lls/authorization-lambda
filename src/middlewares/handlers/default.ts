import { Handler } from 'express';

export const defaultHandler: Handler = (req, res, next) => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  console.info(`${hours}:${minutes}:${seconds} ${req.method} ${req.path}`);

  next();
};
