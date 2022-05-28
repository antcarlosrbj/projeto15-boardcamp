import express from 'express';

import { categoriesGET, categoriesPOST } from './../controllers/categoriesController.js';

const categoriesRouter = express.Router();



categoriesRouter.get("/categories", categoriesGET);
categoriesRouter.post("/categories", categoriesPOST);



export default categoriesRouter;