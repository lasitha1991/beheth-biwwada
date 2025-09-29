import express from 'express';
import cors from 'cors';
import routes from './routes';
import { ensureDb } from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

const port = Number(process.env.PORT || 4000);

ensureDb().then(() => {
  app.listen(port, () => console.log('Backend listening on', port));
}).catch(err => {
  console.error('DB connection failed', err);
  process.exit(1);
});
