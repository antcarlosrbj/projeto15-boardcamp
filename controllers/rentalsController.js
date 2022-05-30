import connection from './db.js';
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