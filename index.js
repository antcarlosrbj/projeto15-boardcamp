import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());



app.get("/", (req, res) => res.send("Hello!!!"))



const port = process.env.PORT_BACK || 4000;
app.listen(port);