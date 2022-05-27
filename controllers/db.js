import dotenv from "dotenv";
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const user = process.env.USER_DB;
const password = process.env.PASSWORD_DB;
const host = process.env.HOST_DB;
const port = process.env.PORT_DB;
const database = process.env.DATABASE_DB;

const connection = new Pool({
  user,
  password,
  host,
  port,
  database
});

export default connection;