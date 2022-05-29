import connection from './db.js';
import joi from 'joi';

export async function gamesGET(req, res) {
    try {

        /* SEARCH IN DATABASE */

        const games = await connection.query(`
            SELECT 
                games.*, 
                categories.name as "categoryName" 
            FROM games 
            JOIN categories 
            ON games."categoryId" = categories.id
        `);

        
        /* FILTER (QUERY STRING) */

        if (req.query.name) {
            res.send(
                games.rows.filter(game => {
                    return RegExp('^' + req.query.name.toLowerCase()).test(game.name.toLowerCase())
                })
            )
            return;
        }

        res.send(games.rows)

    } catch (error) {
        console.log("gamesGET" + error);
        res.sendStatus(500);
    }
}

export async function gamesPOST(req, res) {
    try {

        const newGame = req.body;


        /* VALIDATION (JOI) */

        const userSchema = joi.object({
            name: joi.string().required(),
            image: joi.string().required(),
            stockTotal: joi.number().integer().min(1).required(),
            categoryId: joi.number().integer().required(),
            pricePerDay: joi.number().min(1).required()
        });

        const validation = userSchema.validate(newGame);

        if (validation.error) {
            console.log("gamesPOST/VALIDATION (JOI)");
            res.sendStatus(400);
            return;
        }


        /* DOES CATEGORYID EXIST? */

        const categorie = await connection.query('SELECT * FROM categories WHERE id = $1', [newGame.categoryId]);

        if (!categorie.rows[0]) {
            console.log("gamesPOST/DOES CATEGORYID EXIST?");
            res.sendStatus(400);
            return;
        }


        /* DUPLICATE CHECK */

        const result = await connection.query('SELECT * FROM games WHERE name = $1', [newGame.name]);

        if (result.rows[0]) {
            console.log("gamesPOST/DUPLICATE CHECK");
            res.sendStatus(409);
            return;
        }


        /* SAVE TO DATABASE */

        await connection.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1, $2, $3, $4, $5)', [
            newGame.name, newGame.image, newGame.stockTotal, newGame.categoryId, newGame.pricePerDay]);

        res.sendStatus(201)

    } catch (error) {
        console.log("gamesPOST" + error);
        res.sendStatus(500);
    }
}