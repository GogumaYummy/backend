import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import api from './api';
import createFakeData from './util/createFakeData';

dotenv.config();
const app = new Koa();
const router = new Router();

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

router.use('/api', api.routes());

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

const port = PORT || 5001;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
