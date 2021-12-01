import { Router, Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, JwtPayload, sign, verify } from 'jsonwebtoken';
import { randomSeconds } from '../utils/utils';
import { db } from '../index';

const router = Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Not authorized' });

    try {
        verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET,
            async (error: JsonWebTokenError, payload: JwtPayload) => {
                if (error) return res.status(400).json({ error: 'Invalid request' });

                const userToFind = await db.collection('users').findOne({ _id: payload._id });
                if (!userToFind) next();

                const jwt = sign(
                    { _id: payload._id, email: payload.email },
                    process.env.JWT_SECRET,
                    { expiresIn: randomSeconds(30, 60).toString() + 's' }
                );

                return res.status(201).json({ token: jwt });
            }
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong...' });
    }
});

export default router;