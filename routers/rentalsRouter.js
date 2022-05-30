import express from 'express';

import { rentalsGET, rentalsPOST } from './../controllers/rentalsController.js';

const rentalsRouter = express.Router();



rentalsRouter.get("/rentals", rentalsGET);
rentalsRouter.post("/rentals", rentalsPOST);



export default rentalsRouter;