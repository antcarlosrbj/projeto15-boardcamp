import express from 'express';

import { rentalsGET, rentalsPOST, rentalsPOSTreturn } from './../controllers/rentalsController.js';

const rentalsRouter = express.Router();



rentalsRouter.get("/rentals", rentalsGET);
rentalsRouter.post("/rentals", rentalsPOST);
rentalsRouter.post("/rentals/:id/return", rentalsPOSTreturn);



export default rentalsRouter;