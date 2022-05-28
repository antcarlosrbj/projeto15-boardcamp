import express from 'express';

import { gamesGET, gamesPOST } from './../controllers/gamesController.js';

const gamesRouter = express.Router();



gamesRouter.get("/games", gamesGET);
gamesRouter.post("/games", gamesPOST);



export default gamesRouter;