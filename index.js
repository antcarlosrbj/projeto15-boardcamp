import cors from 'cors';
import express from 'express';

import categoriesRouter from './routers/categoriesRouter.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use(categoriesRouter);


const port = process.env.PORT || 4000;
app.listen(port);