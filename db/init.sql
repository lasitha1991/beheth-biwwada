CREATE TABLE IF NOT EXISTS medicine_records (
  id serial PRIMARY KEY,
  user_id text NOT NULL,
  ts timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_medicine_user_ts ON medicine_records (user_id, ts);
