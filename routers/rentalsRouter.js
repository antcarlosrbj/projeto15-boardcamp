import express from 'express';

import { rentalsGET } from './../controllers/rentalsController.js';

const rentalsRouter = express.Router();



rentalsRouter.get("/rentals", rentalsGET);



export default rentalsRouter;