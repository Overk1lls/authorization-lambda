import { Router, Request, Response } from 'express';
import { db } from '../index';
import IUser from '../interfaces/user';
import { HmacSHA256 } from 'crypto-js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as IUser;

        if (!email || !password) return res.status(400).json({ error: 'Invalid request' });

        const ifExists = await db.collection('users').findOne({ email });
        if (ifExists) return res.status(400).json({ error: 'User already exists' });

        const hashPassword = HmacSHA256(password, process.env.SECRET_KEY).toString();

        const newUser = await db.collection('users').insertOne({
            email,
            password: hashPassword
        });

        if (!newUser.insertedId) return res.status(500).json({ error: 'User is not created' });
        else return res.status(201).json({ response: 'User is created' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong...' });
    }
});

export default router;