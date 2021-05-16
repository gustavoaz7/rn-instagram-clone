/* eslint-disable no-console */
import express from 'express';
import { postsRouter, configureRouter } from './routers';

const PORT = 8000;
const REQUEST_DELAY = 250;

const app = express();

app.use((req, res, next) => {
  console.log('Request url:  ', req.url);
  setTimeout(next, REQUEST_DELAY);
});
app.use(express.json());

app.use('/configure', configureRouter);
app.use('/posts', postsRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
