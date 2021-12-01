import { Router, Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, JwtPayload, verify } from 'jsonwebtoken';
import { db } from '../index';

const router = Router();

router.get('/:num', (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.status(401).json({ error: 'Not authorized' });

    try {
        verify(
            req.headers.authorization.split(' ')[1],
            process.env.JWT_SECRET,
            async (error: JsonWebTokenError, payload: JwtPayload) => {
                if (error) return res.status(401).json({ error: 'Your authorization session is expired' });

                const userToFind = await db.collection('users').findOne({ _id: payload._id });
                if (!userToFind) next();
                
                const userNum = req.params.num;

                return res.status(200).json({
                    request_num: userNum,
                    data: {
                        _id: payload._id,
                        email: payload.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong...' });
    }
});

export default router;