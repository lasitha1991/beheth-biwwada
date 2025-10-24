import { Router } from 'express';
import { pool } from './db';

const router = Router();

router.post('/record', async (req, res) => {
  try {
    const userId = (req.body.userId as string) ?? 'default-user';
    const dateParam = req.body.date as string | undefined; // expected format YYYY-MM-DD (or ISO)

    let tsValue: string;
    if (dateParam && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateParam)) {
      // treat as date only, create UTC midnight for that date
      const parts = dateParam.split('-').map(p => parseInt(p, 10));
      const [y, m, d] = parts;
      const dt = new Date(Date.UTC(y, m - 1, d));
      tsValue = dt.toISOString();
    } else if (dateParam) {
      // fallback: try to parse as ISO timestamp
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        tsValue = parsed.toISOString();
      } else {
        // invalid date string; default to now
        tsValue = new Date().toISOString();
      }
    } else {
      tsValue = new Date().toISOString();
    }

    const result = await pool.query(
      'INSERT INTO medicine_records (user_id, ts) VALUES ($1, $2) RETURNING id, user_id, ts',
      [userId, tsValue]
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

    // Optional year/month filtering (expects year=YYYY and month=MM or M)
    const yearParam = req.query.year as string | undefined;
    const monthParam = req.query.month as string | undefined;

    const year = yearParam ? parseInt(yearParam, 10) : NaN;
    const month = monthParam ? parseInt(monthParam, 10) : NaN; // 1-12
    const dayParam = req.query.day as string | undefined;
    const day = dayParam ? parseInt(dayParam, 10) : NaN; // 1-31

    // If year/month/day are valid, filter for that single day
    if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12 && !Number.isNaN(day) && day >= 1 && day <= 31) {
      const startDate = new Date(Date.UTC(year, month - 1, day));
      // validate constructed date matches requested year/month/day (reject invalid dates like Feb 30)
      if (startDate.getUTCFullYear() === year && startDate.getUTCMonth() === month - 1 && startDate.getUTCDate() === day) {
        const endDate = new Date(Date.UTC(year, month - 1, day + 1));
        const start = startDate.toISOString();
        const end = endDate.toISOString();

        const rows = await pool.query(
          `SELECT id, user_id, ts FROM medicine_records WHERE user_id = $1 AND ts >= $2 AND ts < $3 ORDER BY ts DESC`,
          [userId, start, end]
        );
        res.json(rows.rows);
        return;
      }
      // if invalid date fall through to month handling
    }

    // If year/month provided (but day not provided or invalid), filter for the full month
    if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12) {
      const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
      const end = new Date(Date.UTC(year, month, 1)).toISOString();

      const rows = await pool.query(
        `SELECT id, user_id, ts FROM medicine_records WHERE user_id = $1 AND ts >= $2 AND ts < $3 ORDER BY ts DESC`,
        [userId, start, end]
      );
      res.json(rows.rows);
      return;
    }

    // Fallback: return all records for the user
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
