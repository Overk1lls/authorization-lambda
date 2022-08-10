import { DI } from './di/container';
import { config } from './lib/config';
import { createApp } from './middlewares/app';

async function start() {
  try {
    const { port } = config;
    const deps = await DI.createDependencies();
    const app = createApp(deps);

    app.listen(port, () => console.info(`App is running on port: ${port}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
