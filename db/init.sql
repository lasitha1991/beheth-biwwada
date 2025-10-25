CREATE TABLE IF NOT EXISTS medicine_records (
  id serial PRIMARY KEY,
  user_id text NOT NULL,
  ts_date date NOT NULL DEFAULT current_date
);
CREATE INDEX IF NOT EXISTS idx_medicine_user_ts_date ON medicine_records (user_id, ts_date);
