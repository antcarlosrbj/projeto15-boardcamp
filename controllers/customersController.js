import connection from './db.js';
import joi from 'joi';

export async function customersGET(req, res) {
    try {

        /* SEARCH IN DATABASE */

        const customers = await connection.query('SELECT * FROM customers');

        /* FILTER (QUERY STRING) */

        if (req.query.cpf) {
            res.send(
                customers.rows.filter(customer => {
                    return RegExp('^' + req.query.cpf).test(customer.cpf)
                })
            )
            return;
        }

        res.send(customers.rows)

    } catch (error) {
        console.log("customersGET" + error);
        res.sendStatus(500);
    }
}

export async function customersGETifID(req, res) {
    try {

        const {id} = req.params;

        /* SEARCH IN DATABASE */

        const customers = await connection.query('SELECT * FROM customers');


        /* DOES CATEGORYID EXIST? */

        if (!customers.rows.find(customer => customer.id === Number(id))) {
            console.log("customersGETifID/DOES CATEGORYID EXIST?");
            res.sendStatus(404);
            return;
        }

        
        /* FILTER (PARAMS) */

        res.send(
            customers.rows.filter(customer => customer.id === Number(id))
        )


    } catch (error) {
        console.log("customersGET" + error);
        res.sendStatus(500);
    }
}

export async function customersPOST(req, res) {
    try {

        

    } catch (error) {
        console.log("customersPOST" + error);
        res.sendStatus(500);
    }
}