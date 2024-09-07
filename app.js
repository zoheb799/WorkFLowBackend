    import express from 'express';
    import cookieParser from 'cookie-parser';
    import cors from 'cors';
    import bodyParser from 'body-parser';
    import path from 'path';
    import fs from 'fs';
    import router from './routes/router.js';

    export const app = express();

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(cookieParser());
    app.use(cors());
    app.use(bodyParser.json()); // Parse JSON bodies

    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    }

    app.use('/api/v1', router);
