import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
});
pool
    .connect()
    .then((client) => {
    console.log('Connected to the database!');
    client.release();
})
    .catch((err) => console.error('Error connecting to the database', err));
export const query = (text, params) => pool.query(text, params);
export default pool;
