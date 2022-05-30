import connection from './db.js';
import joi from 'joi';

export async function customersGET(req, res) {
    try {

        const customers = await connection.query('SELECT * FROM customers');
        res.send(customers.rows)

    } catch (error) {
        console.log("customersGET" + error);
        res.sendStatus(500);
    }
}

export async function customersGETifID(req, res) {
    try {

       

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