import express from 'express';

import { customersGET, customersGETifID, customersPOST } from './../controllers/customersController.js';

const customersRouter = express.Router();



customersRouter.get("/customers", customersGET);
customersRouter.get("/customers/:id", customersGETifID);
customersRouter.post("/customers", customersPOST);



export default customersRouter;