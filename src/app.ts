import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { scrap, objPattern } from './scrap';
import { isInTheList } from './utils/api_helper';

const app = express();
app.use(cors());

app.get('/api/noFilter', async (req, res) => {
  const data: objPattern[] = await scrap();
  res.send(data);
});

app.get('/api/filter', async (req, res) => {
  const filterBy: any = Object.values(req.query);
  const data: objPattern[] = await scrap();
  const filteredData: objPattern[] = data.filter((element) =>
    isInTheList(element, filterBy) ? element : null
  );

  res.json(filteredData);
});

app.get('/api/eliminate', async (req, res) => {
  const eliminateBy: any = Object.values(req.query);
  const data: objPattern[] = await scrap();
  const filteredData: objPattern[] = data.filter((element) =>
    isInTheList(element, eliminateBy) ? null : element
  );

  res.json(filteredData);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
