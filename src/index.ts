import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Db, MongoClient } from 'mongodb';
import signUp from './routes/signUp';
import login from './routes/login';
import me from './routes/me';
import refresh from './routes/refresh';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
let db: Db;

app.use(cors());
app.use(express.json());
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const currDate = new Date();
    console.log(currDate.getHours() + ':' + currDate.getMinutes() + ':' + currDate.getSeconds(), req.method, req.path, req.query, req.params, req.body);
    next();
});
app.use('/api/signup', signUp);
app.use('/api/login', login);
app.use('/api/me', me);
app.use('/api/refresh', refresh);

async function start() {
    try {
        const mongo = await MongoClient.connect(process.env.MONGO_URI);
        db = mongo.db(process.env.MONGO_DB);

        app.listen(PORT, () => console.log('App is running on port: ' + PORT));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();

export { db };