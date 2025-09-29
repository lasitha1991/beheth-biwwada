import { Router } from 'express';
import { pool } from './db';

const router = Router();

router.post('/record', async (req, res) => {
  try {
    const userId = (req.body.userId as string) ?? 'default-user';
    const result = await pool.query(
      'INSERT INTO medicine_records (user_id, ts) VALUES ($1, now()) RETURNING id, user_id, ts',
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/records', async (req, res) => {
  try {
    const userId = (req.query.userId as string) ?? 'default-user';
    const rows = await pool.query(
      `SELECT id, user_id, ts FROM medicine_records WHERE user_id = $1 ORDER BY ts DESC`,
      [userId]
    );
    res.json(rows.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

export default router;
