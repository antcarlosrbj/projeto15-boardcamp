import express from 'express';

import { rentalsGET, rentalsPOST, rentalsPOSTreturn, rentalsDELETE } from './../controllers/rentalsController.js';

const rentalsRouter = express.Router();



rentalsRouter.get("/rentals", rentalsGET);
rentalsRouter.post("/rentals", rentalsPOST);
rentalsRouter.post("/rentals/:id/return", rentalsPOSTreturn);
rentalsRouter.delete("/rentals/:id", rentalsDELETE);



export default rentalsRouter;