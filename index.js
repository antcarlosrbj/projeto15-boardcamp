import cors from 'cors';
import express from 'express';
import connection from './controllers/db.js';

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
    const result = await connection.query('SELECT * FROM categories');
    res.send(result.rows)
})

const port = process.env.PORT || 4000;
app.listen(port);