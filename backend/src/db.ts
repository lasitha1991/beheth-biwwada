import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://tracker:trackerpass@localhost:5432/trackerdb';
export const pool = new Pool({ connectionString });

export async function ensureDb() {
  await pool.query('SELECT 1');
}
