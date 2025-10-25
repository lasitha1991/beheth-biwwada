import { Router, Request, Response } from 'express';
import { pool } from './db';

const router = Router();

router.post('/record', async (req: Request, res: Response) => {
  try {
    const userId = (req.body.userId as string) ?? 'default-user';
    const dateParam = req.body.date as string | undefined; // expected format YYYY-MM-DD (or ISO)

    // derive a date-only string (YYYY-MM-DD) for ts_date using UTC to avoid TZ surprises
    let tsDate: string;
    if (dateParam && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(dateParam)) {
      tsDate = dateParam; // already YYYY-MM-DD
    } else if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        tsDate = parsed.toISOString().slice(0, 10);
      } else {
        tsDate = new Date().toISOString().slice(0, 10);
      }
    } else {
      tsDate = new Date().toISOString().slice(0, 10);
    }

    const result = await pool.query(
      'INSERT INTO medicine_records (user_id, ts_date) VALUES ($1, $2) RETURNING id, user_id, ts_date',
      [userId, tsDate]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

router.get('/records', async (req: Request, res: Response) => {
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
        // use YYYY-MM-DD date strings for comparison against ts_date (date column)
        const start = startDate.toISOString().slice(0, 10);
        const end = endDate.toISOString().slice(0, 10);

        const rows = await pool.query(
          `SELECT id, user_id, ts_date FROM medicine_records WHERE user_id = $1 AND ts_date >= $2 AND ts_date < $3 ORDER BY ts_date DESC`,
          [userId, start, end]
        );
        res.json(rows.rows);
        return;
      }
      // if invalid date fall through to month handling
    }

    // If year/month provided (but day not provided or invalid), filter for the full month
    if (!Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12) {
      const start = new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0, 10);
      const end = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);

      const rows = await pool.query(
        `SELECT id, user_id, ts_date FROM medicine_records WHERE user_id = $1 AND ts_date >= $2 AND ts_date < $3 ORDER BY ts_date DESC`,
        [userId, start, end]
      );
      res.json(rows.rows);
      return;
    }

    // Fallback: return all records for the user
    const rows = await pool.query(
      `SELECT id, user_id, ts_date FROM medicine_records WHERE user_id = $1 ORDER BY ts_date DESC`,
      [userId]
    );
    res.json(rows.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

export default router;
