import connection from './db.js';
import joi from 'joi';

export async function categoriesGET(req, res) {
    try {

        const result = await connection.query('SELECT * FROM categories');
        res.send(result.rows)

    } catch (error) {
        console.log("categoriesGET" + error);
        res.sendStatus(500);
    }
}

export async function categoriesPOST(req, res) {
    try {

        const newCategory = req.body;

        /* VALIDATION (JOI) */

        const userSchema = joi.object({
            name: joi.string().required()
        });

        const validation = userSchema.validate(newCategory);

        if (validation.error) {
            console.log("categoriesPOST/VALIDATION (JOI)");
            res.sendStatus(400);
            return;
        }

        /* DUPLICATE CHECK */

        const result = await connection.query('SELECT * FROM categories WHERE name = $1', [newCategory.name]);
        
        if(result.rows[0]) {
            console.log("categoriesPOST/DUPLICATE CHECK");
            res.sendStatus(409);
            return;
        }

        /* SAVE TO DATABASE */

        await connection.query('INSERT INTO categories (name) VALUES ($1)', [newCategory.name]);
        
        res.sendStatus(201)

    } catch (error) {
        console.log("categoriesPOST" + error);
        res.sendStatus(500);
    }
}