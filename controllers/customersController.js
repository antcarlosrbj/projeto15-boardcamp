import connection from './db.js';
import joi from 'joi';
import dayjs from 'dayjs';

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

        const newCustomer = req.body;


        /* VALIDATION (JOI) */

        const validation = customersSchema.validate(newCustomer);

        if (validation.error) {
            console.log("customersPOST/VALIDATION (JOI)");
            res.sendStatus(400);
            return;
        }


        /* VALIDATION (BIRTHDAY) */

        if (!birthdayValidation(newCustomer.birthday)) {
            console.log("customersPOST/VALIDATION (BIRTHDAY)");
            res.sendStatus(400);
            return;
        }


        /* DUPLICATE CHECK */

        const result = await connection.query('SELECT * FROM customers WHERE cpf = $1', [newCustomer.cpf]);

        if (result.rows[0]) {
            console.log("customersPOST/DUPLICATE CHECK");
            res.sendStatus(409);
            return;
        }


        /* SAVE TO DATABASE */
        
        await connection.query('INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1, $2, $3, $4)', [
            newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday
        ]);

        res.sendStatus(201)

    } catch (error) {
        console.log("customersPOST" + error);
        res.sendStatus(500);
    }
}

export async function customersPUT(req, res) {
    try {

        const newCustomer = req.body;
        const {id} = req.params;


        /* VALIDATION (JOI) */

        const validation = customersSchema.validate(newCustomer);

        if (validation.error) {
            console.log("customersPUT/VALIDATION (JOI)");
            res.sendStatus(400);
            return;
        }


        /* VALIDATION (BIRTHDAY) */

        if (!birthdayValidation(newCustomer.birthday)) {
            console.log("customersPUT/VALIDATION (BIRTHDAY)");
            res.sendStatus(400);
            return;
        }


        /* DOES CUSTOMERID EXIST? */

        const customer = await connection.query('SELECT * FROM customers WHERE id = $1', [id]);

        if (!customer.rows[0]) {
            console.log("customersPUT/DOES CUSTOMERID EXIST?");
            res.sendStatus(400);
            return;
        }


        /* DUPLICATE CHECK */

        const result = await connection.query('SELECT * FROM customers WHERE cpf = $1 AND ID != $2', [newCustomer.cpf, id]);

        if (result.rows[0]) {
            console.log("customersPUT/DUPLICATE CHECK");
            res.sendStatus(409);
            return;
        }


        /* SAVE TO DATABASE */
        
        await connection.query('UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5', [
            newCustomer.name, newCustomer.phone, newCustomer.cpf, newCustomer.birthday, id
        ]);

        res.sendStatus(200)


    } catch (error) {
        console.log("customersPUT" + error);
        res.sendStatus(500);
    }
}



const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(new RegExp('^[0-9]{10,11}$')).required(),
    cpf: joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
    birthday: joi.string().required()
});


function birthdayValidation(birthday) {
    let birthdayArray = birthday.split('-', 3).map(Number);
    let birthdayDayjs;

    if (birthdayArray[0] && birthdayArray[1] && birthdayArray[2]) {
        birthdayDayjs = dayjs(birthdayArray);
    } else {
        birthdayDayjs = null;
    }

    if (!birthdayDayjs) {
        return false;
    }

    if (
        birthdayDayjs.date() !== birthdayArray[2] ||
        birthdayDayjs.month() + 1 !== birthdayArray[1] ||
        birthdayDayjs.year() !== birthdayArray[0] ||
        birthdayDayjs > dayjs() ||
        birthdayDayjs.year() < 1850
    ) {
        return false;
    }

    return true;
}