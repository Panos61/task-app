import pg from 'pg';
import config from '@/config.js';

const { Pool } = pg;

const pool = new Pool({
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
});

pool
  .connect()
  .then((client) => {
    console.log('Connected to the database!');
    client.release();
  })
  .catch((err) => console.error('Error connecting to the database', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
