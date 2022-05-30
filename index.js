import cors from 'cors';
import express from 'express';

import categoriesRouter from './routers/categoriesRouter.js';
import gamesRouter from './routers/gamesRouter.js';
import customersRouter from './routers/customersRouter.js';
import rentalsRouter from './routers/rentalsRouter.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use(categoriesRouter);
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalsRouter);


const port = process.env.PORT || 4000;
app.listen(port);