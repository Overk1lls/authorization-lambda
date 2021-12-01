import { HmacSHA256 } from 'crypto-js';
import { Router, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { randomSeconds } from '../utils/utils';
import { db } from '../index';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.query as any;

        if (!email || !password) return res.status(400).json({ error: 'Invalid request' });

        const hashPassword = HmacSHA256(password, process.env.SECRET_KEY).toString();

        const userToFind = await db.collection('users').findOne({ email, password: hashPassword });
        if (!userToFind) return res.status(404).json({ error: 'User is not found' });

        const jwt = sign(
            { _id: userToFind._id, email },
            process.env.JWT_SECRET,
            { expiresIn: randomSeconds(30, 60).toString() + 's' }
        );

        return res.status(201).json({ token: jwt });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong...' });
    }
});

export default router;