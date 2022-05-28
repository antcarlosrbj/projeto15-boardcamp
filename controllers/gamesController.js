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

        

    } catch (error) {
        console.log("gamesPOST" + error);
        res.sendStatus(500);
    }
}