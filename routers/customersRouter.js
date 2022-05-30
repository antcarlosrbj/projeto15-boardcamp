import express from 'express';

import { customersGET, customersGETifID, customersPOST, customersPUT } from './../controllers/customersController.js';

const customersRouter = express.Router();



customersRouter.get("/customers", customersGET);
customersRouter.get("/customers/:id", customersGETifID);
customersRouter.post("/customers", customersPOST);
customersRouter.put("/customers/:id", customersPUT);



export default customersRouter;