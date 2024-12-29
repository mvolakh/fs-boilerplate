import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        res.send('Hello world!');
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;