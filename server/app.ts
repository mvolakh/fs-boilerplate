import express, { Application, Request, Response } from 'express';
import { Server } from 'http';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
import colors from 'colors';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import dbHandler from './db/dbHandler';

import helloRouter from './routes/hello';

const dotenvConfig = dotenv.config();
dotenvExpand.expand(dotenvConfig);

const app: Application = express();

const apiRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(cors({ origin: '*' }));
if (process.env.ENV === 'PROD') {
    app.use('/api/', apiRateLimiter);
}
if (process.env.ENV === 'DEV') { 
    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, 'dist')));
}

const initializeApp = async () : Promise<void> => {
    try {
        const server: Server = app.listen(process.env.PORT, () => {
            console.log(`[SERVER] ${colors.green(`Listening on port ${process.env.PORT}`)}`);
            console.log(`[SERVER] ${colors.green(`Serving at:`)} http://localhost:${process.env.PORT}`);
        });

        await dbHandler.connect();

        app.use('/api', helloRouter); // Boilterplate route

        if (process.env.ENV === 'DEV') { 
            app.get('/*', (req: Request, res: Response) => {
                res.sendFile(path.join(__dirname, 'dist', 'index.html'));
            });
        }
    } catch (err) {
        console.error(`[APP] ${colors.red(`Error while running the application: ${err}`)}`);
    }
};

initializeApp();