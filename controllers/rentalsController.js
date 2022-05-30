import connection from './db.js';
import joi from 'joi';
import dayjs from 'dayjs';

export async function rentalsGET(req, res) {
    try {

        /* SEARCH IN DATABASE */

        let rentals = await connection.query(`
        SELECT 

            rentals.*, 

            customers.id as customer_id,
            customers.name as customer_name,

            games.id as game_id, 
            games.name as game_name, 
            games."categoryId" as game_category_id,

            categories.name as category_name

        FROM rentals 

        JOIN customers 
        ON rentals."customerId" = customers.id 

        JOIN games 
        ON rentals."gameId" = games.id 

        JOIN categories 
        ON games."categoryId" = categories.id

        `);


        /* ORGANIZE OBJECT */

        rentals = rentals.rows.map(rental => {
            return ({
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: dayjs(rental.rentDate).format('YYYY-MM-DD'),
                daysRented: rental.daysRented,
                returnDate: rental.returnDate, 
                originalPrice: rental.originalPrice,
                delayFee: rental.delayFee,
                customer: {
                    id: rental.customer_id,
                    name: rental.customer_name
                },
                game: {
                    id: rental.game_id,
                    name: rental.game_name,
                    categoryId: rental.game_category_id,
                    categoryName: rental.category_name
                }
            });
        })


        /* FILTER CUSTOMERID (QUERY STRING) */

        if (req.query.customerId) {
            res.send(
                rentals.filter(rental => rental.customer.id === Number(req.query.customerId))
            )
            return;
        }


        /* FILTER GAMEID (QUERY STRING) */

        if (req.query.gameId) {
            res.send(
                rentals.filter(rental => rental.game.id === Number(req.query.gameId))
            )
            return;
        }

        res.send(rentals)

    } catch (error) {
        console.log("rentalsGET" + error);
        res.sendStatus(500);
    }
}

export async function rentalsPOST(req, res) {
    try {

        const newRentals = req.body;


        /* VALIDATION (JOI) */

        const rentalsSchema = joi.object({
            customerId: joi.number().integer().min(1).required(),
            gameId: joi.number().integer().min(1).required(),
            daysRented: joi.number().integer().min(1).required()
        });

        const validation = rentalsSchema.validate(newRentals);

        if (validation.error) {
            console.log("rentalsPOST/VALIDATION (JOI)");
            res.sendStatus(400);
            return;
        }
        

        /* DOES CUSTOMERID EXIST? */

        const customer = await connection.query('SELECT * FROM customers WHERE id = $1', [newRentals.customerId]);

        if (!customer.rows[0]) {
            console.log("rentalsPOST/DOES CUSTOMERID EXIST?");
            res.sendStatus(400);
            return;
        }


        /* DOES GAMEID EXIST? */

        const game = await connection.query('SELECT * FROM games WHERE id = $1', [newRentals.gameId]);

        if (!game.rows[0]) {
            console.log("rentalsPOST/DOES GAMEID EXIST?");
            res.sendStatus(400);
            return;
        }


        /* IS THERE GAME STOCK? */

        const rentals = await connection.query('SELECT * FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL', [newRentals.gameId]);
        const leasedAmount = rentals.rows.length;

        if (game.rows[0].stockTotal <= leasedAmount) {
            console.log("rentalsPOST/IS THERE GAME STOCK?");
            res.sendStatus(400);
            return;
        }


        /* SAVE TO DATABASE */
        
        await connection.query('INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") VALUES ($1, $2, $3, $4, null, $5, null)', [
            newRentals.customerId, newRentals.gameId, dayjs().format('YYYY-MM-DD'), newRentals.daysRented, (newRentals.daysRented * game.rows[0].pricePerDay)
        ]);

        res.sendStatus(201)

    } catch (error) {
        console.log("rentalsPOST" + error);
        res.sendStatus(500);
    }
}

export async function rentalsPOSTreturn(req, res) {
    try {

        const {id} = req.params;


        /* DOES RENTAL ID EXIST? */

        const rental = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);

        if (!rental.rows[0]) {
            console.log("rentalsPOSTreturn/DOES RENTAL ID EXIST?");
            res.sendStatus(404);
            return;
        }
        

        /* RENTAL ID HAS ALREADY BEEN RETURNED? */

        if (rental.rows[0].returnDate) {
            console.log("rentalsPOSTreturn/RENTAL ID HAS ALREADY BEEN RETURNED?");
            res.sendStatus(400);
            return;
        }


        /* CHECK DELAY */

        const game = await connection.query('SELECT * FROM games WHERE id = $1', [rental.rows[0].gameId]);

        let delayFee = 0;

        if (Math.floor((dayjs() - dayjs(rental.rows[0].rentDate))/86400000) > rental.rows[0].daysRented) {
            const delayDays = Math.floor((dayjs() - rental.rows[0].rentDate) /86400000) - rental.rows[0].daysRented;
            delayFee = delayDays * game.rows[0].pricePerDay;
        }
        

        /* SAVE TO DATABASE */
        
        await connection.query('UPDATE rentals SET "customerId"=$1, "gameId"=$2, "rentDate"=$3, "daysRented"=$4, "returnDate"=$5, "originalPrice"=$6, "delayFee"=$7 WHERE id=$8', [
            rental.rows[0].customerId, rental.rows[0].gameId, rental.rows[0].rentDate, rental.rows[0].daysRented, dayjs().format('YYYY-MM-DD'), rental.rows[0].originalPrice, delayFee, id
        ]);

        res.sendStatus(200)


    } catch (error) {
        console.log("rentalsPUT" + error);
        res.sendStatus(500);
    }
}