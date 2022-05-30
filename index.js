import cors from 'cors';
import express from 'express';

import categoriesRouter from './routers/categoriesRouter.js';
import gamesRouter from './routers/gamesRouter.js';
import customersRouter from './routers/customersRouter.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);


const port = process.env.PORT || 4000;
app.listen(port);